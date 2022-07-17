import * as THREE from 'three'

const CustomPass = {

  uniforms: {
    tDiffuse: { value: null },
    tSize: { value: new THREE.Vector2(256, 256) },
    center: { value: new THREE.Vector2(0.5, 0.5) },
    angle: { value: 1.57 },
    scale: { value: 1.0 },
    uTime: { value: 0 }
  },

  vertexShader: [

    'varying vec2 vUv;',

    'void main() {',

    '	vUv = uv;',
    '	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

    '}'

  ].join('\n'),

  fragmentShader: [

    'uniform vec2 center;',
    'uniform float angle;',
    'uniform float scale;',
    'uniform vec2 tSize;',
    'uniform float uTime;',

    'uniform sampler2D tDiffuse;',

    'varying vec2 vUv;',

    'float pattern() {',

    '	float s = sin( angle ), c = cos( angle );',

    '	vec2 tex = vUv * tSize - center;',
    '	vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;',

    '	return ( sin( point.x ) * sin( point.y ) ) * 4.0;',

    '}',

    'void main() {',
    '   vec2 p = 2.0 * vUv - vec2(1.0, 1.0);',
    '   p += 0.1 * cos(2.0 * p.yx + uTime + vec2(1.2, 3.4));',
    '   p += 0.1 * cos(2.7 * p.yx + 1.4 * uTime + vec2(1.2, 3.4));',
    '   p += 0.1 * cos(3.0 * p.yx + 2.0 * uTime + vec2(2.2, 1.4));',
    '   p += 0.3 * cos(2.0 * p.yx + 2.6 * uTime + vec2(10.2, 3.4));',
    '   vec2 newUv = vec2(mix(vUv.x, length(p), 1.0 + 0.0), mix(vUv.y, 0.0, 1.0 + 0.0));',
    '   vec4 color = texture2D(tDiffuse, newUv);',
    '   gl_FragColor = color;',
    '}'

  ].join('\n')

}

export { CustomPass }
