/*
 * test_controller.js
 *
 * For testing API endpoints
 * Apr 12 2018
 * Joshua Kerber
 */

export const test = (req, res) => {
  console.log('test endpoint');
  res.status(200).send('test success');
}
