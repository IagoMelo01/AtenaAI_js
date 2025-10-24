// lib/polyfills/react-element-symbol.js
// Normaliza o símbolo utilizado pelos elementos React criados em versões antigas
// (React 18 e anteriores) para que sejam compatíveis com o runtime do React 19.
// Deve ser importado antes de qualquer renderização ocorrer.

const symbolFor = Symbol.for.bind(Symbol);
const symbolKeyFor = Symbol.keyFor ? Symbol.keyFor.bind(Symbol) : undefined;
const transitionalElement = symbolFor('react.transitional.element');
const legacyElement = symbolFor('react.element');

if (legacyElement !== transitionalElement && !globalThis.__reactLegacyElementPatched) {
  globalThis.__reactLegacyElementPatched = true;

  Symbol.for = function patchedSymbolFor(key) {
    if (key === 'react.element') {
      return transitionalElement;
    }
    return symbolFor(key);
  };

  if (symbolKeyFor) {
    Symbol.keyFor = function patchedSymbolKeyFor(sym) {
      if (sym === transitionalElement) {
        return 'react.element';
      }

      const result = symbolKeyFor(sym);
      if (result === 'react.transitional.element') {
        return 'react.element';
      }
      return result;
    };
  }
}
