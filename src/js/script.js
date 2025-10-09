// // Wavy Background Animation
// class WavyBackground {
//     constructor(canvas) {
//         this.canvas = canvas;
//         this.ctx = canvas.getContext('2d');
//         this.colors = ['#a855f7', '#ec4899', '#06b6d4', '#8b5cf6', '#f97316'];
//         this.waveWidth = 60;
//         this.blur = 12;
//         this.waveOpacity = 0.3;
//         this.speed = 0.001;
//         this.nt = 0;
//         this.init();
//     }

//     init() {
//         this.resize();
//         window.addEventListener('resize', () => this.resize());
//         this.ctx.filter = `blur(${this.blur}px)`;
//         this.animate();
//     }

//     resize() {
//         this.canvas.width = window.innerWidth;
//         this.canvas.height = window.innerHeight;
//         this.ctx.filter = `blur(${this.blur}px)`;
//     }

//     noise(x, y, z) {
//         // Simplified noise function for wave effect
//         const X = Math.floor(x) & 255;
//         const Y = Math.floor(y) & 255;
//         const Z = Math.floor(z) & 255;

//         const u = this.fade(x - Math.floor(x));
//         const v = this.fade(y - Math.floor(y));
//         const w = this.fade(z - Math.floor(z));

//         const A = this.p[X] + Y;
//         const AA = this.p[A] + Z;
//         const AB = this.p[A + 1] + Z;
//         const B = this.p[X + 1] + Y;
//         const BA = this.p[B] + Z;
//         const BB = this.p[B + 1] + Z;

//         return this.lerp(w,
//             this.lerp(v,
//                 this.lerp(u, this.grad(this.p[AA], x, y, z), this.grad(this.p[BA], x - 1, y, z)),
//                 this.lerp(u, this.grad(this.p[AB], x, y - 1, z), this.grad(this.p[BB], x - 1, y - 1, z))
//             ),
//             this.lerp(v,
//                 this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1), this.grad(this.p[BA + 1], x - 1, y, z - 1)),
//                 this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1), this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))
//             )
//         );
//     }

//     fade(t) {
//         return t * t * t * (t * (t * 6 - 15) + 10);
//     }

//     lerp(t, a, b) {
//         return a + t * (b - a);
//     }

//     grad(hash, x, y, z) {
//         const h = hash & 15;
//         const u = h < 8 ? x : y;
//         const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
//         return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
//     }

//     // Permutation table for noise
//     p = (() => {
//         const p = [];
//         for (let i = 0; i < 256; i++) {
//             p[i] = Math.floor(Math.random() * 256);
//         }
//         return [...p, ...p];
//     })();

//     drawWave(n) {
//         this.nt += this.speed;

//         for (let i = 0; i < n; i++) {
//             this.ctx.beginPath();
//             this.ctx.lineWidth = this.waveWidth;
//             this.ctx.strokeStyle = this.colors[i % this.colors.length];

//             for (let x = 0; x < this.canvas.width; x += 5) {
//                 const y = this.noise(x / 800, 0.3 * i, this.nt) * 100;
//                 this.ctx.lineTo(x, y + this.canvas.height * 0.5);
//             }

//             this.ctx.stroke();
//             this.ctx.closePath();
//         }
//     }

//     animate() {
//         this.ctx.fillStyle = 'hsl(220, 25%, 8%)';
//         this.ctx.globalAlpha = this.waveOpacity;
//         this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
//         this.drawWave(5);
//         requestAnimationFrame(() => this.animate());
//     }
// }

// // Initialize wavy background
// const canvas = document.getElementById('wavy-canvas');
// const wavyBg = new WavyBackground(canvas);

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".form");
    const input = document.getElementById("description");
    const btn = document.querySelector(".btn-magic");
    const htmlCode = document.getElementById("html-code");
    const cssCode = document.getElementById("css-code");
    const preview = document.querySelector(".preview-card");

    function setLoading(isLoading) {
        const btnSpan = document.querySelector(".btn-magic span");
        btnSpan.innerHTML = isLoading ? `Gerando Background...` : "Gerar Background Mágico";
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const description = input.value.trim();
        if (!description) {
            return;
        }
        setLoading(true);

        try {
            const response = await fetch("https://n8n.srv830193.hstgr.cloud/webhook/4096b767-f3fb-4244-bb3c-2df7994c2262", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description }),
            });

            const data = await response.json();

            htmlCode.textContent = data.code || "";
            cssCode.textContent = data.style || "";

            preview.style.display = "block";
            preview.innerHTML = data.code || "";

            // Remove estilos antigos
            let styleTag = document.getElementById("dynamic-style");
            if (styleTag) styleTag.remove();
            if (data.style) {
                styleTag = document.createElement("style");
                styleTag.id = "dynamic-style";
                styleTag.textContent = data.style;
                document.head.appendChild(styleTag);
            }
        } catch (err) {
            console.error("Erro ao gerar o fundo:", err);
            htmlCode.textContent = "Não consegui gerar o fundo. Tente novamente.";
            cssCode.textContent = "/* CSS gerado aparece aqui */";
            preview.innerHTML = "";
        } finally {
            setLoading(false);
        }
    });
});