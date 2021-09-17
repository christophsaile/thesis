if (typeof registerPaint !== 'undefined') {
  class LinearPath {
    static get inputProperties() {
      return ['--path-points', '--path-range', '--path-color'];
    }

    paint(ctx, size, properties) {
      const points = JSON.parse(String(properties.get('--path-points')));
      const range = JSON.parse(String(properties.get('--path-range')));
      const color = String(properties.get('--path-color')) || '#000';

      const height = size.height;
      const width = size.width;
      const centerX = 100 / range.x / 2 / 100;

      ctx.lineWidth = 2;
      ctx.strokeStyle = color;

      ctx.beginPath();

      for (let i = 0; i < points.length; i++) {
        const x = points[i].x;
        const y = points[i].y;
        const newX = width * (x / range.x + centerX);
        const newY = height - height * (y / range.y);
        ctx.lineTo(newX, newY);
      }

      ctx.stroke();
    }
  }
  registerPaint('linearPath', LinearPath);
}
