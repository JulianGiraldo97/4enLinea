# Documentación Técnica: Juego 4 en Línea

## 1. Descripción General

Esta documentación describe la implementación de un juego "4 en Línea" (también conocido como Connect Four) utilizando tecnologías web estándar: HTML, CSS y JavaScript. El juego ha sido diseñado para ser jugado en navegadores web y desplegado mediante GitHub Pages.

## 2. Arquitectura de la Solución

### 2.1 Tecnologías Utilizadas

- **HTML5**: Estructura básica del juego y elementos visuales
- **CSS3**: Estilos, animaciones y diseño responsive
- **JavaScript (ES6+)**: Lógica del juego y manipulación del DOM
- **GitHub**: Control de versiones
- **GitHub Actions**: CI/CD y automatización del despliegue
- **GitHub Pages**: Hosting y despliegue

### 2.2 Estructura de Archivos

```
/
├── index.html           # Archivo principal HTML (versión todo-en-uno)
├── styles.css           # Estilos CSS (versión modular)
├── script.js            # Lógica JavaScript (versión modular)
└── .github/
    └── workflows/
        └── deploy.yml   # Configuración del workflow de GitHub Actions
```

### 2.3 Versiones

Se han desarrollado dos versiones del juego:
1. **Versión Todo-en-Uno**: Todo el código (HTML, CSS y JavaScript) en un solo archivo `index.html`
2. **Versión Modular**: Código separado en archivos distintos para HTML, CSS y JavaScript

## 3. Detalles de Implementación

### 3.1 Estructura del Tablero

El tablero de juego está implementado como una cuadrícula (grid) CSS con las siguientes dimensiones:
- 7 columnas (ancho estándar del juego 4 en línea)
- 6 filas (altura estándar del juego 4 en línea)

```javascript
const ROWS = 6;
const COLS = 7;
```

Cada celda del tablero es un elemento `div` con clases CSS que definen su apariencia y comportamiento.

### 3.2 Modelo de Datos

El estado del juego se mantiene en una matriz bidimensional:

```javascript
let board = Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY));
```

Donde cada posición puede tener uno de los siguientes valores:
- `EMPTY` (0): Celda vacía
- `PLAYER1` (1): Ficha del jugador 1 (rojo)
- `PLAYER2` (2): Ficha del jugador 2 (amarillo)

### 3.3 Algoritmos Principales

#### 3.3.1 Colocación de Fichas

```javascript
function dropPiece(col) {
    // Encontrar la primera fila disponible desde abajo
    for (let row = 0; row < ROWS; row++) {
        if (board[row][col] === EMPTY) {
            board[row][col] = currentPlayer;
            return row;
        }
    }
    return -1; // Columna llena
}
```

#### 3.3.2 Detección de Victoria

El algoritmo verifica todas las direcciones posibles (horizontal, vertical, diagonal /) para encontrar 4 fichas consecutivas del mismo jugador:

```javascript
function checkWin(row, col) {
    const directions = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonal /
        [1, -1]   // diagonal \
    ];
    
    for (const [dx, dy] of directions) {
        let count = 1;  // La ficha que acabamos de colocar
        
        // Comprobamos en ambas direcciones
        for (const factor of [1, -1]) {
            const newDx = dx * factor;
            const newDy = dy * factor;
            
            let r = row + newDx;
            let c = col + newDy;
            
            while (
                r >= 0 && r < ROWS && 
                c >= 0 && c < COLS && 
                board[r][c] === currentPlayer
            ) {
                count++;
                r += newDx;
                c += newDy;
            }
        }
        
        if (count >= 4) {
            return true;
        }
    }
    
    return false;
}
```

### 3.4 Características Visuales

- **Animación de caída**: Las fichas tienen una animación CSS que simula la caída física.
- **Feedback visual**: Resaltado de columnas al pasar el cursor por encima.
- **Mensajes de estado**: Información sobre el turno actual y resultado del juego.
- **Diseño responsive**: Se adapta a diferentes tamaños de pantalla.

## 4. Proceso de Despliegue

### 4.1 Configuración de GitHub Pages

GitHub Pages se utiliza para alojar el juego, haciendo que sea accesible a través de una URL pública.

### 4.2 Workflow de GitHub Actions

El proceso de CI/CD se implementa mediante un workflow de GitHub Actions que automatiza el despliegue en GitHub Pages:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 4.3 Pasos del Proceso de Despliegue

1. **Activación**: El workflow se activa automáticamente con cada push a la rama principal o manualmente.
2. **Checkout**: Se descarga el código fuente del repositorio.
3. **Setup Pages**: Se configura el entorno de GitHub Pages.
4. **Upload artifact**: Se empaquetan los archivos estáticos.
5. **Deploy**: Se realiza el despliegue en GitHub Pages.

## 5. Solución de Problemas Comunes

### 5.1 Error 404 en GitHub Pages

Si el sitio muestra un error 404 después del despliegue, verifica:

1. **Nombre del archivo principal**: Debe ser exactamente `index.html` (sensible a mayúsculas/minúsculas).
2. **Ubicación del archivo**: Debe estar en la raíz del repositorio o en la ubicación especificada en la configuración.
3. **Configuración de GitHub Pages**: Asegúrate de que la fuente está correctamente configurada.
4. **Estado del workflow**: Verifica que el workflow se completó correctamente.
5. **Permisos**: Confirma que los permisos en el workflow son correctos.

### 5.2 Problemas de Compatibilidad con Navegadores

El juego utiliza características estándar de HTML5, CSS3 y JavaScript moderno. Para máxima compatibilidad:
- Utiliza navegadores modernos actualizados
- Se recomienda Chrome, Firefox, Edge o Safari en sus versiones recientes

## 6. Extensiones y Mejoras Posibles

### 6.1 Funcionalidad

- Implementar modo un jugador con IA
- Añadir sistema de puntuación y estadísticas
- Implementar multijugador online

### 6.2 Rendimiento

- Minificar CSS y JavaScript para reducir tiempos de carga
- Implementar service workers para funcionalidad offline
- Optimizar animaciones para dispositivos de bajo rendimiento

### 6.3 Accesibilidad

- Mejorar la navegación por teclado
- Añadir etiquetas ARIA para lectores de pantalla
- Implementar modos de alto contraste

## 7. Conclusiones

Esta implementación del juego "4 en línea" demuestra cómo las tecnologías web estándar pueden utilizarse para crear juegos interactivos sin necesidad de frameworks adicionales. El uso de GitHub Actions y GitHub Pages proporciona un flujo de trabajo de despliegue automatizado y gratuito, ideal para proyectos web estáticos como este.