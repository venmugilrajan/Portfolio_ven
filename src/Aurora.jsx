import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';
import './Aurora.css';

const VERT = `#version 300 es
in vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uBlend;

out vec4 fragColor;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    
    // Mouse influence - stronger distortion
    vec2 mouseDir = uv - uMouse;
    float dist = length(mouseDir);
    float mouseInfluence = smoothstep(0.6, 0.0, dist);
    
    vec2 distortedUV = uv + mouseDir * mouseInfluence * 0.2;
    
    float noise1 = snoise(vec2(distortedUV.x * 0.8 + uTime * 0.05, distortedUV.y * 0.5 + uTime * 0.02));
    float noise2 = snoise(vec2(distortedUV.x * 1.2 - uTime * 0.03, distortedUV.y * 0.8 + uTime * 0.04));
    
    float intensity = smoothstep(0.0, 1.0, noise1 * 0.5 + 0.5);
    intensity += smoothstep(0.0, 1.0, noise2 * 0.5 + 0.5) * 0.5;
    intensity *= (1.0 + mouseInfluence * 0.5);
    
    vec3 color = mix(uColorStops[0], uColorStops[1], distortedUV.x);
    color = mix(color, uColorStops[2], intensity * uAmplitude);
    
    // Darken by reducing base intensity
    color *= 0.8;
    
    fragColor = vec4(color, uBlend * (1.0 - mouseInfluence * 0.2));
}
`;

const Aurora = (props) => {
    const {
        colorStops = ["#7cff67", "#B19EEF", "#5227FF"],
        amplitude = 1.0,
        blend = 0.5,
        speed = 1.0
    } = props;

    const canvasRef = useRef(null);
    const propsRef = useRef(props);
    const mouseRef = useRef([0.5, 0.5]);
    const targetMouseRef = useRef([0.5, 0.5]);

    useEffect(() => {
        propsRef.current = props;
    }, [props]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleMouseMove = (e) => {
            targetMouseRef.current = [
                e.clientX / window.innerWidth,
                1.0 - (e.clientY / window.innerHeight)
            ];
        };

        window.addEventListener('mousemove', handleMouseMove);

        const renderer = new Renderer({
            canvas,
            alpha: true,
            premultipliedAlpha: true,
            antialias: true
        });

        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        let program;

        function resize() {
            const width = canvas.parentElement?.offsetWidth || window.innerWidth;
            const height = canvas.parentElement?.offsetHeight || window.innerHeight;
            renderer.setSize(width, height);
            if (program) {
                program.uniforms.uResolution.value = [width, height];
            }
        }

        window.addEventListener('resize', resize);

        const geometry = new Triangle(gl);
        if (geometry.attributes.uv) delete geometry.attributes.uv;

        const colorStopsArray = colorStops.map(hex => {
            const c = new Color(hex);
            return [c.r, c.g, c.b];
        });

        program = new Program(gl, {
            vertex: VERT,
            fragment: FRAG,
            uniforms: {
                uTime: { value: 0 },
                uAmplitude: { value: amplitude },
                uColorStops: { value: colorStopsArray },
                uResolution: { value: [gl.canvas.width, gl.canvas.height] },
                uMouse: { value: [0.5, 0.5] },
                uBlend: { value: blend }
            }
        });

        const mesh = new Mesh(gl, { geometry, program });

        let animateId = 0;
        const update = t => {
            animateId = requestAnimationFrame(update);
            
            // LERP Mouse position
            mouseRef.current[0] += (targetMouseRef.current[0] - mouseRef.current[0]) * 0.05;
            mouseRef.current[1] += (targetMouseRef.current[1] - mouseRef.current[1]) * 0.05;
            program.uniforms.uMouse.value = mouseRef.current;

            const currentProps = propsRef.current;
            const speed = currentProps.speed ?? 1.0;
            const amp = currentProps.amplitude ?? 1.0;
            const bl = currentProps.blend ?? 0.5;
            const stops = currentProps.colorStops || colorStops;

            program.uniforms.uTime.value = t * 0.0001 * speed;
            program.uniforms.uAmplitude.value = amp;
            program.uniforms.uBlend.value = bl;
            
            program.uniforms.uColorStops.value = stops.slice(0, 3).map(hex => {
                const c = new Color(hex || "#ffffff");
                return [c.r, c.g, c.b];
            });

            renderer.render({ scene: mesh });
        };

        resize();
        animateId = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(animateId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="aurora-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>
    );
};

export default Aurora;
