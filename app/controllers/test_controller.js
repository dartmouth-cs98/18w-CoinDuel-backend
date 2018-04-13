/*
 * test_controller.js
 *
 * For testing API endpoints
 * Apr 12 2018
 * Joshua Kerber
 */

export const test = (req, res) => {
  var sms = require('sms-sending');
  sms.send('text message', 9784605401);
}
