# Pasta de Imagens

Esta pasta contém todas as imagens estáticas do site Jabour Jewellery.

## Estrutura de Pastas

### `/rings`
Imagens de anéis de noivado e casamento.
- Formato sugerido: JPG ou WebP
- Tamanho recomendado: 800x800px (mínimo) até 2000x2000px (máximo)
- Nomenclatura: `nome-do-produto-metal-formato.jpg`
  - Exemplo: `classic-solitaire-platinum-round.jpg`

### `/diamonds`
Imagens de diamantes individuais.
- Formato sugerido: JPG ou WebP
- Tamanho recomendado: 600x600px

### `/jewellery`
Imagens de outras joias (brincos, pingentes, etc).
- Formato sugerido: JPG ou WebP
- Tamanho recomendado: 800x800px

### `/about`
Imagens para a página About Us.
- Workshop, equipe, processos
- Tamanho recomendado: 1200x800px

### `/hero`
Imagens para hero sections das páginas.
- Imagens de destaque
- Tamanho recomendado: 1920x1080px

## Dicas

1. **Otimização**: Use ferramentas como ImageOptim ou TinyPNG para comprimir imagens
2. **Formato WebP**: Para melhor performance, considere converter para WebP
3. **Nomenclatura**: Use nomes descritivos e consistentes
4. **Aspect Ratio**: Mantenha proporções consistentes para cada categoria

## Uso no Código

```tsx
// Usando Image do Next.js (recomendado)
import Image from 'next/image'

<Image
  src="/images/rings/classic-solitaire.jpg"
  alt="Classic Solitaire Ring"
  width={800}
  height={800}
/>

// Ou usando tag img padrão
<img src="/images/rings/classic-solitaire.jpg" alt="Classic Solitaire Ring" />
```

