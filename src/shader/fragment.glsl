precision mediump float;

uniform float uTime;
uniform sampler2D uTexture;
uniform vec4 resolution;

varying vec2 vUv;

void main()
{
    vec4 color = texture2D(uTexture, vUv);
    gl_FragColor = color;
}