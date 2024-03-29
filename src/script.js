import './style.css'

import * as THREE from 'three'
import TouchTexture from './TouchTexture'
import image1 from '../assets/images/test1.jpg'
import image2 from '../assets/images/test2.jpg'
import image3 from '../assets/images/test3.jpg'

import fragmentShader from './shader/fragment.glsl'
import vertexShader from './shader/vertex.glsl'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { CustomPass as PixelRiverPass } from './PixelRiverPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

// Variables
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const colors = {
  rendererClearColor: 0x000000
}

// Scene
const scene = new THREE.Scene()

// TouchTexture
const touchTexture = new TouchTexture(128)

// Renderer
const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor(colors.rendererClearColor, 1)
renderer.outputEncoding = THREE.sRGBEncoding
document.body.appendChild(renderer.domElement)

// Camera
const camera = new THREE.PerspectiveCamera(
  70,
  sizes.width / sizes.height,
  0.001,
  1000
)
camera.position.z = 5

// Postprocessing
const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))

const customShaderPass = new ShaderPass(PixelRiverPass)
customShaderPass.uniforms.uTouchTexture.value = touchTexture.texture
customShaderPass.uniforms.uDimensions.value = new THREE.Vector2(sizes.width, sizes.height)
composer.addPass(customShaderPass)

// Textures
const textureLoader = new THREE.TextureLoader()

const textures = [image1, image2, image3].map(url => {
  return textureLoader.load(url)
})

// Geometry
const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)

// Meshes
const images = new THREE.Group()

textures.forEach((texture, index) => {
  const material = new THREE.RawShaderMaterial({
    extensions: {
      derivatives: '#extension GL_OES_standard_derivatives : enable'
    },
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: texture },
      uResolution: { value: new THREE.Vector4() }
    },
    fragmentShader,
    vertexShader
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = index * 1.5 - 1.5
  mesh.position.y = -3
  mesh.rotation.z = Math.PI / 2
  images.add(mesh)
})

images.position.z = 0.5
scene.add(images)

// Listeners
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  customShaderPass.uniforms.uDimensions.value = new THREE.Vector2(sizes.width, sizes.height)
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
}, false)

window.addEventListener('mousemove', onMouseMove, false)

const mousePosition = new THREE.Vector2(0, 0)

function onMouseMove (e) {
  mousePosition.x = e.clientX
  mousePosition.y = e.clientY
  touchTexture.addTouch(touchTexture.getTouchTexturePosition(sizes.width, sizes.height, mousePosition.x, mousePosition.y), 1)
}

// Sliders
document.getElementById('scale').oninput = function () {
  customShaderPass.uniforms.scale.value = this.value
}

document.getElementById('colorX').oninput = function () {
  customShaderPass.uniforms.colorXFactor.value = this.value
}

document.getElementById('colorY').oninput = function () {
  customShaderPass.uniforms.colorYFactor.value = this.value
}

document.getElementById('radius').oninput = function () {
  touchTexture.radius = this.value
}

document.getElementById('textureX').oninput = function () {
  images.position.x = this.value
}

document.getElementById('textureZ').oninput = function () {
  images.position.z = this.value
}

// Animation Loop
let time = 0

const tick = () => {
  time += 0.01

  customShaderPass.uniforms.uTime.value = time
  touchTexture.update()
  requestAnimationFrame(tick)
  composer.render()
}

tick()
