Plano para ajustar o notebook 3D:

1. Corrigir a orientação do modelo
- Deixar o notebook aberto em pé, com a tela vertical/frontal e a base visível em perspectiva baixa, como nas referências enviadas.
- Ajustar o pivô da tampa para a dobradiça funcionar corretamente, evitando a sensação de notebook “deitado”.
- Definir o ângulo final da tampa em torno de 100–105°, com a tela apontada para a câmera.

2. Reposicionar câmera e controles
- Travar a câmera em uma vista frontal limpa no desktop e no mobile.
- Usar uma câmera mais baixa e centralizada, aproximando o enquadramento do exemplo `laptop-1-1536x1536-3.png`.
- Reduzir a liberdade do OrbitControls para impedir que o notebook fique torto/deitado após interação.
- Ajustar FOV, distância e posição responsiva para mobile, garantindo que a tela e a base apareçam inteiras.

3. Remover o traço/elemento errado no meio
- Revisar os meshes da tela, bezel, glass overlay e possíveis sobreposições que estejam criando o “traço no meio”.
- Remover qualquer plano, faixa ou geometria visualmente desalinhada no centro.
- Manter a imagem atual na tela do notebook, sem trocar o fundo roxo que você aprovou.

4. Recriar acabamento com base nas fotos enviadas
- Melhorar proporções: tela mais grossa, bordas arredondadas, moldura preta, dobradiça mais realista e base mais fina.
- Adicionar detalhes inspirados nas referências: teclado mais denso, trackpad central, grelhas/sulcos discretos, portas laterais, pés inferiores e textura metálica escovada.
- Manter o visual premium sem exagerar em elementos que pareçam “card solto”.

5. Movimento suave
- Suavizar a animação de entrada com GSAP: abrir a tampa, leve subida e estabilização.
- Reduzir rotação automática e flutuação para o notebook parecer firme/em pé.
- Preservar performance no mobile usando o modo leve já existente.

Detalhes técnicos:
- Continuar usando React Three Fiber, Drei, Three.js e GSAP, que já estão no projeto.
- Usar referências visuais das imagens enviadas para proporção e acabamento, sem embutir essas imagens como textura do modelo.
- Manter `screen-poster.jpg` como imagem da tela.
- Editar principalmente `src/components/effects/Notebook3DShowcase.tsx`, com ajuste pontual em `ModelViewer3D.tsx` se o parallax externo estiver prejudicando o enquadramento.