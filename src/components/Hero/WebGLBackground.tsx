"use client";

import { useEffect, useRef } from "react";

export default function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Handle high DPI screens
    const resizeCanvas = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Vertex shader source
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader source (renders animated mesh gradients using time and sine/cosine coordinate shifting)
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;

      // Simple pseudo-noise based on sine waves
      float noise(vec2 p) {
        return sin(p.x * 1.5 + sin(p.y * 1.2)) * cos(p.y * 1.3 + cos(p.x * 0.8));
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        
        // Scale and shift coordinates based on time for organic movement
        vec2 p1 = uv * 2.0 - vec2(1.0);
        p1.x += sin(u_time * 0.15) * 0.5;
        p1.y += cos(u_time * 0.2) * 0.4;
        
        vec2 p2 = uv * 2.0 - vec2(1.0);
        p2.x += cos(u_time * 0.25) * 0.6;
        p2.y += sin(u_time * 0.1) * 0.5;

        // Create fluid color blobs
        float n1 = noise(p1 * 1.5) * 0.5 + 0.5;
        float n2 = noise(p2 * 2.0) * 0.5 + 0.5;
        
        // Color definitions
        vec3 darkBackground = vec3(0.011, 0.0, 0.078); // #030014
        vec3 enterpriseBlue = vec3(0.0, 0.4, 1.0);     // #0066ff
        vec3 lightCyan = vec3(0.0, 0.85, 1.0);        // #00d9ff
        
        // Blend colors based on noise values
        vec3 finalColor = mix(darkBackground, enterpriseBlue, n1 * 0.6);
        finalColor = mix(finalColor, lightCyan, n2 * 0.25);
        
        // Add subtle overlay glow at the bottom center
        float bottomGlow = 1.0 - distance(uv, vec2(0.5, 0.0));
        bottomGlow = clamp(bottomGlow, 0.0, 1.0);
        finalColor += enterpriseBlue * pow(bottomGlow, 3.0) * 0.35;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Compile shader helper
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Create geometry (two triangles covering the viewport)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Lookup uniforms
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    // Render loop
    let animationFrameId: number;
    const startTime = Date.now();

    const render = () => {
      resizeCanvas();

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Clean up
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        opacity: 0.8,
      }}
    />
  );
}
