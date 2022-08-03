import * as THREE from 'three'

const CustomPass = {

  uniforms: {
    tDiffuse: { value: null },
    tSize: { value: new THREE.Vector2(256, 256) },
    center: { value: new THREE.Vector2(0.5, 0.5) },
    angle: { value: 1.57 },
    scale: { value: 1 },
    uTime: { value: 0 },
    uTouchTexture: { value: null },
    uDimensions: { value: null },
    colorXFactor: { value: -0.8 },
    colorYFactor: { value: -0.8 }
  },

  vertexShader:
    `varying vec2 vUv;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      vUv = uv;
    }`,

  fragmentShader:
    `uniform vec2 center;
    uniform float angle;
    uniform float scale;
    uniform vec2 tSize;
    uniform float uTime;
    uniform sampler2D uTouchTexture;
    uniform vec2 uDimensions;
    uniform float colorXFactor;
    uniform float colorYFactor;
    uniform float riverColorFactor;
    uniform sampler2D tDiffuse;

    varying vec2 vUv;

    void main() {
      float mouseDistortion = texture2D(uTouchTexture, vec2((gl_FragCoord.x / uDimensions.x) / 2.0, (gl_FragCoord.y / uDimensions.y) / 2.0)).r;
      vec2 p = 2.0 * vUv - vec2(1.0, 1.0);
      p += 0.1 * cos(scale * 2.0 * p.yx + uTime + vec2(1.2, 3.4));
      p += 0.1 * cos(scale * 2.7 * p.yx + 1.4 * uTime + vec2(1.2, 3.4));
      p += 0.1 * cos(scale * 3.0 * p.yx + 2.0 * uTime + vec2(2.2, 1.4));
      p += 0.2 * cos(scale * 2.0 * p.yx + 2.6 * uTime + vec2(10.2, 3.4));
      p += mouseDistortion * 2.;
      vec2 newUv = vec2(mix(vUv.x, length(p), 1. + 0.0), mix(vUv.y, 0.0, 1.));
      vec4 color = texture2D(tDiffuse, newUv);
      color.y = color.y + (mouseDistortion / p.x) * colorYFactor;
      color.x = color.x + (mouseDistortion / p.y) * colorXFactor;
      gl_FragColor = color;
    }`
}

export { CustomPass }
