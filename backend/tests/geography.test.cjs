const test = require('node:test');
const assert = require('node:assert/strict');
const { findCountry, findState, geographicCoordinates, locationOptions } = require('../dist/services/geography');
test('country aliases and ISO codes canonicalize consistently', () => {
  assert.equal(findCountry('IN').name, 'India');
  assert.equal(findCountry('usa').isoCode, 'US');
  assert.equal(findCountry('South Korea').isoCode, 'KR');
  assert.equal(findState('India', 'UP').name, 'Uttar Pradesh');
});
test('worldwide cities resolve with the country and region context', () => {
  const lucknow = geographicCoordinates('India', 'Uttar Pradesh', 'Lucknow', 'city');
  assert.ok(Math.abs(lucknow[0] - 26.84) < 0.1);
  const paris = geographicCoordinates('France', 'Île-de-France', 'Paris', 'city');
  assert.ok(Math.abs(paris[0] - 48.85) < 0.1);
});
test('unknown or inconsistent locations never receive guessed city coordinates', () => {
  assert.equal(geographicCoordinates('India', 'Maharashtra', 'Lucknow', 'city'), undefined);
  assert.equal(geographicCoordinates('India', 'Unknown state', 'Lucknow', 'city'), undefined);
  assert.equal(geographicCoordinates('Unknown country', null, 'Paris', 'city'), undefined);
});
test('location options use country and state rather than a shared city list', () => {
  assert.ok(locationOptions('India').some(state => state.name === 'Uttar Pradesh'));
  assert.ok(locationOptions('India', 'Uttar Pradesh').some(city => city.name === 'Lucknow'));
  assert.deepEqual(locationOptions('Unknown country'), []);
});
