# Corrida Educativa - Jogo de Corrida de Carros

Este é um jogo de corrida de carros simples e responsivo desenvolvido em HTML5 Canvas e TypeScript para o projeto Engenhando+.

## Características

- **Responsivo** - Adapta-se a diferentes tamanhos de tela (desktop e mobile)
- **Controles intuitivos** - Controles simplificados para desktop e mobile
- **Dificuldade progressiva** - A velocidade e frequência de obstáculos aumenta com o tempo
- **Visual atraente** - Carros com rodas visíveis e efeitos visuais
- **Compatível com navegadores modernos** - Funciona em qualquer navegador com suporte a HTML5

## Como jogar

### Controles de Desktop
- **Setas direcionais ← →** ou **Teclas A/D**: Mover o carro para a esquerda ou direita
- **Barra de espaço**: Reiniciar após Game Over

### Controles de Mobile
- **Toque na metade esquerda da tela**: Mover para a esquerda
- **Toque na metade direita da tela**: Mover para a direita
- **Toque após Game Over**: Reiniciar o jogo

## Objetivo

- Desvie dos carros inimigos
- Colete moedas douradas para ganhar pontos
- Pegue power-ups verdes para ganhar pontos extras
- Sobreviva o máximo possível!

## Implementação técnica

O jogo foi implementado usando HTML5 Canvas para renderização e TypeScript para lógica. Os principais componentes são:

- `RacingGame.tsx` - Componente React principal
- `CanvasRacingGame.tsx` - Componente que gerencia o elemento canvas e UI do jogo
- `CarRacingGame.ts` - Classe que implementa a lógica do jogo

### Recursos

- Renderização responsiva que se adapta a qualquer tamanho de tela
- Sistema de colisão preciso
- Movimento suave entre faixas
- Geração aleatória de obstáculos com dificuldade crescente
- Suporte a controles por toque e teclado
