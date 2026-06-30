const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const sourcePath = path.resolve(__dirname, '../../frontend/src/lib/shopCatalog.ts');
const outputPath = path.resolve(__dirname, '../data/shop-products.json');
const sourceText = fs.readFileSync(sourcePath, 'utf8');
const sourceFile = ts.createSourceFile(sourcePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

const env = new Map();

const getText = (node) => {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isIdentifier(node) && node.text === 'undefined') return undefined;
  if (ts.isIdentifier(node) && node.text === 'null') return null;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) return -getText(node.operand);
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isTypeAssertionExpression(node)) {
    return getText(node.expression);
  }
  if (ts.isArrayLiteralExpression(node)) return node.elements.map((element) => getText(element));
  if (ts.isObjectLiteralExpression(node)) {
    const value = {};
    node.properties.forEach((property) => {
      if (!ts.isPropertyAssignment(property)) return;
      const key = property.name.getText(sourceFile).replace(/['"]/g, '');
      value[key] = getText(property.initializer);
    });
    return value;
  }
  if (ts.isPropertyAccessExpression(node)) {
    const left = getText(node.expression);
    if (left && typeof left === 'object') return left[node.name.text];
    return undefined;
  }
  if (ts.isIdentifier(node)) {
    return env.get(node.text);
  }
  if (ts.isCallExpression(node)) {
    const callee = node.expression.getText(sourceFile);
    if (callee === 'txt') {
      const [en, ko, hi] = node.arguments.map((arg) => getText(arg));
      return { en, ko, hi };
    }
    if (callee === 'product') {
      const [
        id,
        sku,
        title,
        subtitle,
        description,
        categoryKey,
        image,
        price,
        compareAtPrice,
        rewardPoints,
        inStock,
        stockLabel,
        badges,
        includes,
      ] = node.arguments.map((arg) => getText(arg));
      const categories = env.get('shopCategories') || [];
      const byKey = Object.fromEntries(categories.map((category) => [category.key, category]));
      return {
        id,
        slug: id,
        sku,
        title,
        subtitle,
        description,
        categoryKey,
        category: byKey[categoryKey]?.label || categories[0]?.label || { en: categoryKey, ko: categoryKey, hi: categoryKey },
        image,
        price,
        compareAtPrice,
        rewardPoints,
        inStock,
        stockLabel,
        badges,
        includes,
      };
    }
  }
  return undefined;
};

sourceFile.statements.forEach((statement) => {
  if (!ts.isVariableStatement(statement)) return;
  statement.declarationList.declarations.forEach((declaration) => {
    if (!ts.isIdentifier(declaration.name) || !declaration.initializer) return;
    const value = getText(declaration.initializer);
    if (typeof value !== 'undefined') {
      env.set(declaration.name.text, value);
    }
  });
});

const shopProducts = env.get('shopProducts');
if (!Array.isArray(shopProducts)) {
  throw new Error('Failed to extract shopProducts from shopCatalog.ts');
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(shopProducts, null, 2));
console.log(`Wrote ${shopProducts.length} products to ${outputPath}`);
