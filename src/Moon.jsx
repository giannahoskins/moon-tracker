import { Canvas } from '@react-three/fiber'
import { Sphere, OrbitControls, useTexture, Stars } from '@react-three/drei'
import moonImage from '../assets/moon-texture.jpg'
import moonBump from '../assets/displacement.jpg'

function MoonSphere() {
    const [texture, bumpMap] = useTexture([moonImage, moonBump])

    return (
        <mesh position={[0, -1, 0]}>
            <Sphere args={[1, 32, 32]}>
                <meshStandardMaterial 
                    map={texture} 
                    bumpMap={bumpMap}
                    bumpScale={0.05}
                />
            </Sphere>
        </mesh>
    )
}

function Moon({ lightX, lightZ }) {
    return (
        <Canvas className="moon-canvas">
            <ambientLight intensity={0.1} />
            <directionalLight position={[lightX, 0, lightZ]} intensity={1} />
            <OrbitControls />
            <MoonSphere />
            <Stars
                radius={100}
                depth={70}
                count={6000}
                factor={7}
                saturation={0}
                fade
            />
        </Canvas>
    )
}

export default Moon