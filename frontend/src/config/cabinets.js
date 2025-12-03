export const cabinets = [
    {
        id: 'ducati-monster',
        name: 'Ducati Monster',
        type: 'component', // Uses the existing React component
        componentProps: { color: '#ff2a00' }, // Default Red
        thumbnail: '/thumbnails/ducati_red.png', // Placeholder, will handle missing image gracefully
        description: 'The classic aggressive naked bike aesthetic. Trellis frame, exposed engine, raw power.',
        scale: 1,
        position: [0, 0, 0],
        rotation: [0, 0, 0]
    },
    {
        id: 'stealth-ops',
        name: 'Stealth Ops',
        type: 'component',
        componentProps: { color: '#111111' }, // Black variant
        thumbnail: '/thumbnails/stealth_black.png',
        description: 'Matte black finish for covert operations. Minimal reflections, maximum performance.',
        scale: 1,
        position: [0, 0, 0],
        rotation: [0, 0, 0]
    },
    {
        id: 'cyber-neon',
        name: 'Cyber Neon',
        type: 'component',
        componentProps: { color: '#00ffff' }, // Cyan variant
        thumbnail: '/thumbnails/cyber_neon.png',
        description: 'High-visibility neon coating for the digital frontier.',
        scale: 1,
        position: [0, 0, 0],
        rotation: [0, 0, 0]
    }
    // Future GLB example:
    // {
    //     id: 'nzxt-h9',
    //     name: 'NZXT H9 Flow',
    //     type: 'glb',
    //     file: '/models/nzxt_h9.glb',
    //     thumbnail: '/thumbnails/nzxt.png',
    //     description: 'Dual-chamber mid-tower air flow case.',
    //     scale: 1,
    //     position: [0, 0, 0],
    //     rotation: [0, 0, 0]
    // }
];

export const getCabinetById = (id) => cabinets.find(c => c.id === id) || cabinets[0];
export const getAllCabinets = () => cabinets;
