function drawCircle(target,r,container)
{
  const containerRect = container.getBoundingClientRect();
  console.log(containerRect);
  // Create an SVG element
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  // Set the SVG attributes (e.g., width, height)
  var realCX = target.getBoundingClientRect().left - containerRect.left + target.getBoundingClientRect().width/2;
  var realCY = target.getBoundingClientRect().top - containerRect.top + target.getBoundingClientRect().height/2;
  svg.setAttribute("width", containerRect.width.toString());
  svg.setAttribute("height", containerRect.height.toString());
  svg.setAttribute("left", containerRect.left.toString());
  svg.setAttribute("top", containerRect.top.toString());
  //svg.setAttribute("border", "2px solid red");
  // Create a circle element
  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

  // Set the circle attributes (e.g., cx, cy, r, fill)
  circle.setAttribute("cx", realCX.toString());
  circle.setAttribute("cy", realCY.toString());
  circle.setAttribute("r", r.toString());
  circle.setAttribute("fill", "white");
  circle.setAttribute("stroke", "black");
  circle.setAttribute("stroke-dasharray", "5,5");

  // Append the circle to the SVG element
  svg.appendChild(circle);

  // Append the SVG element to the div
  container.appendChild(svg);
}

function checkCollisionAABBs(element, elements)
{
  for (const rect of elements) {
    if (
      element.x < rect.x + rect.width &&
      element.x + element.width > rect.x &&
      element.y < rect.y + rect.height &&
      element.y + element.height > rect.y
    ) {
        return true;
    }
  }
  return false;
}

function calculateProjection(x, y, Vx, Vy) {
    const dotProduct = x * Vx + y * Vy;
    const magnitudeSquared = Vx * Vx + Vy * Vy;
    
    const projectionX = (dotProduct / magnitudeSquared) * Vx;
    const projectionY = (dotProduct / magnitudeSquared) * Vy;
    
    return { x: projectionX, y: projectionY };
  }

function checkPolygonCollision(poly1, poly2) {
    // Loop through each edge of both polygons
    for (let i = 0; i < poly1.length; i++) {
        const edge = getEdge(poly1, i);

        // Project polygons onto the axis perpendicular to the edge
        const projection1 = projectPolygon(poly1, edge);
        const projection2 = projectPolygon(poly2, edge);

        // Check if projections overlap
        if (!isOverlap(projection1, projection2)) {
        // Separating axis found, polygons do not collide
        return false;
        }
    }

    // No separating axis found, polygons collide
    return true;
}

function getEdge(poly, index) {
    const point1 = poly[index];
    const point2 = poly[(index + 1) % poly.length];
    const edge = {
        x: point2.x - point1.x,
        y: point2.y - point1.y
    };
    return edge;
}

function projectPolygon(poly, axis) {
    const projection = {
        min: dotProduct(poly[0], axis),
        max: dotProduct(poly[0], axis)
    };

    for (let i = 1; i < poly.length; i++) {
        const dot = dotProduct(poly[i], axis);
        projection.min = Math.min(projection.min, dot);
        projection.max = Math.max(projection.max, dot);
    }

    return projection;
}

function dotProduct(point, axis) {
    return point.x * axis.x + point.y * axis.y;
}

function isOverlap(projection1, projection2) {
    return projection1.max >= projection2.min && projection2.max >= projection1.min;
}
  

function getRotatedPos(poly, angle)
{
    // Calculate center point of the rectangle
    const centerX = (poly[0].x + poly[1].x + poly[2].x + poly[3].x) / 4;
    const centerY = (poly[0].y + poly[1].y + poly[2].y + poly[3].y) / 4;

    // Translate rectangle to center at origin
    const translatedX1 = poly[0].x - centerX;
    const translatedY1 = poly[0].y - centerY;
    const translatedX2 = poly[1].x - centerX;
    const translatedY2 = poly[1].y - centerY;
    const translatedX3 = poly[2].x - centerX;
    const translatedY3 = poly[2].y - centerY;
    const translatedX4 = poly[3].x - centerX;
    const translatedY4 = poly[3].y - centerY;

    // Apply rotation transformation
    const rotatedX1 = translatedX1 * Math.cos(Math.PI / 4) - translatedY1 * Math.sin(Math.PI / 4);
    const rotatedY1 = translatedX1 * Math.sin(Math.PI / 4) + translatedY1 * Math.cos(Math.PI / 4);
    const rotatedX2 = translatedX2 * Math.cos(Math.PI / 4) - translatedY2 * Math.sin(Math.PI / 4);
    const rotatedY2 = translatedX2 * Math.sin(Math.PI / 4) + translatedY2 * Math.cos(Math.PI / 4);
    const rotatedX3 = translatedX3 * Math.cos(Math.PI / 4) - translatedY3 * Math.sin(Math.PI / 4);
    const rotatedY3 = translatedX3 * Math.sin(Math.PI / 4) + translatedY3 * Math.cos(Math.PI / 4);
    const rotatedX4 = translatedX4 * Math.cos(Math.PI / 4) - translatedY4 * Math.sin(Math.PI / 4);
    const rotatedY4 = translatedX4 * Math.sin(Math.PI / 4) + translatedY4 * Math.cos(Math.PI / 4);

    // Translate rectangle back to original position
    const newX1 = rotatedX1 + centerX;
    const newY1 = rotatedY1 + centerY;
    const newX2 = rotatedX2 + centerX;
    const newY2 = rotatedY2 + centerY;
    const newX3 = rotatedX3 + centerX;
    const newY3 = rotatedY3 + centerY;
    const newX4 = rotatedX4 + centerX;
    const newY4 = rotatedY4 + centerY;
}

function checkProximity(element, target, Factor)
{
  if(Factor.proximity == null)
    return true;
  var dx = element.x + element.width/2-target.x - target.width/2;
  var dy = element.y + element.height/2-target.y - target.height/2;
  return (Math.sqrt(dx**2 +dy**2) >= Factor.proximity);
}

// Function to convert RGB to Lab color space
function rgbToLab(r, g, b) {
  // Normalize RGB values
  var R = r / 255;
  var G = g / 255;
  var B = b / 255;

  // Linearize RGB values
  R = (R > 0.04045) ? Math.pow(((R + 0.055) / 1.055), 2.4) : (R / 12.92);
  G = (G > 0.04045) ? Math.pow(((G + 0.055) / 1.055), 2.4) : (G / 12.92);
  B = (B > 0.04045) ? Math.pow(((B + 0.055) / 1.055), 2.4) : (B / 12.92);

  // Convert RGB to XYZ
  var X = R * 0.4124564 + G * 0.3575761 + B * 0.1804375;
  var Y = R * 0.2126729 + G * 0.7151522 + B * 0.0721750;
  var Z = R * 0.0193339 + G * 0.1191920 + B * 0.9503041;

  // Convert XYZ to Lab
  X = X / 0.95047;
  Y = Y / 1.00000;
  Z = Z / 1.08883;
  X = (X > 0.008856) ? Math.pow(X, (1 / 3)) : (7.787 * X) + (16 / 116);
  Y = (Y > 0.008856) ? Math.pow(Y, (1 / 3)) : (7.787 * Y) + (16 / 116);
  Z = (Z > 0.008856) ? Math.pow(Z, (1 / 3)) : (7.787 * Z) + (16 / 116);

  var L = (116 * Y) - 16;
  var a = 500 * (X - Y);
  var b = 200 * (Y - Z);

  return [L, a, b];
}

// Function to calculate color difference using CIEDE2000 formula
function ciede2000Lab(Lab1, Lab2) {
  var kL = 1;
  var kC = 1;
  var kH = 1;

  // Calculate CIEDE2000 color difference
  var ΔL = Lab2[0] - Lab1[0];
  var L_ = (Lab1[0] + Lab2[0]) / 2;
  var C1 = Math.sqrt(Math.pow(Lab1[1], 2) + Math.pow(Lab1[2], 2));
  var C2 = Math.sqrt(Math.pow(Lab2[1], 2) + Math.pow(Lab2[2], 2));
  var C_ = (C1 + C2) / 2;
  var a1_ = Lab1[1] + (Lab1[1] / 2) * (1 - Math.sqrt(Math.pow(C_, 7) / (Math.pow(C_, 7) + Math.pow(25, 7))));
  var a2_ = Lab2[1] + (Lab2[1] / 2) * (1 - Math.sqrt(Math.pow(C_, 7) / (Math.pow(C_, 7) + Math.pow(25, 7))));
  var C1_ = Math.sqrt(Math.pow(a1_, 2) + Math.pow(Lab1[2], 2));
  var C2_ = Math.sqrt(Math.pow(a2_, 2) + Math.pow(Lab2[2], 2));
  var ΔC_ = C2_ - C1_;
  var ΔH_ = Math.sqrt(Math.pow(Lab1[1] - Lab2[1], 2) + Math.pow(Lab1[2] - Lab2[2], 2) - Math.pow(ΔC_, 2));
  var H1_ = Math.atan2(Lab1[2], a1_) * (180 / Math.PI);
  H1_ = (H1_ + 360) % 360;
  var H2_ = Math.atan2(Lab2[2], a2_) * (180 / Math.PI);
  H2_ = (H2_ + 360) % 360;
  var ΔH__;
  if (Math.abs(H1_ - H2_) <= 180) {
      ΔH__ = H2_ - H1_;
  } else if (H2_ <= H1_) {
      ΔH__ = H2_ - H1_ + 360;
  } else {
      ΔH__ = H2_ - H1_ - 360;
  }
  var ΔH_ = 2 * Math.sqrt(C1_ * C2_) * Math.sin((ΔH__ / 2) * (Math.PI / 180));
  var H_ = (Math.abs(H1_ - H2_) <= 180) ? (H1_ + H2_) / 2 : (H1_ + H2_ + 360) / 2;
  var T = 1 - 0.17 * Math.cos((H_ - 30) * (Math.PI / 180)) + 0.24 * Math.cos(2 * H_ * (Math.PI / 180)) + 0.32 * Math.cos((3 * H_ + 6) * (Math.PI / 180)) - 0.20 * Math.cos((4 * H_ - 63) * (Math.PI / 180));
  var SL = 1 + ((0.015 * Math.pow((L_ - 50), 2)) / Math.sqrt(20 + Math.pow((L_ - 50), 2)));
  var SC = 1 + 0.045 * C_;
  var SH = 1 + 0.015 * C_ * T;
  var RT = -2 * Math.sqrt(Math.pow(C_, 7) / (Math.pow(C_, 7) + Math.pow(25, 7))) * Math.sin((60 * Math.exp(-Math.pow((H_ - 275) / 25, 2))) * (Math.PI / 180));

  var ΔE00 = Math.sqrt(Math.pow(ΔL / (kL * SL), 2) + Math.pow(ΔC_ / (kC * SC), 2) + Math.pow(ΔH_ / (kH * SH), 2) + RT * (ΔC_ / (kC * SC)) * (ΔH_ / (kH * SH)));

  return ΔE00;
}
