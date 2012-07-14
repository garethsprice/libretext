<?php
// API exposes simple read-only requests so only needs POST
if($_SERVER['REQUEST_METHOD'] != 'POST') { header('HTTP/1.0 405 Method Not Allowed'); header('Allow: POST'); exit('Sorry, that method is not allowed'); }

// ** DECLARE VARIABLES **
require_once 'Wordlist.php';

$Wordlist = new Wordlist();
$strings = array(
  'language' => NULL, 
  'characters' => NULL,
);
$options = $Wordlist->options;
$required = array_keys($strings);

// ** PROCESS REQUEST **
foreach($required as $key) {
  if(empty($_POST[$key])) {
    header('HTTP/1.0 400 Bad Request'); exit('Sorry, your request must specify at least the following values: ' . implode(', ', $required));
  }
}

foreach(array_keys($strings) as $key) {
  if(!empty($_POST[$key])) {
    // Need to verify that this works with extended character sets OK
    filter_input(INPUT_POST, 'key', FILTER_SANITIZE_STRING);
    $strings[$key] = $_POST[$key];
  }
}

foreach(array_keys($options) as $key) {
  if(!empty($_POST[$key])) {
    // If the options are set to a boolean by default, don't pass the value - just set TRUE
    // this is because forms usually return "on" from the browser which !== TRUE in PHP.
    if(is_bool($options[$key])) {
      $options[$key] = TRUE;
    } else {
      filter_input(INPUT_POST, 'key', FILTER_SANITIZE_STRING);
      $options[$key] = $_POST[$key];
    }
  }
}

// ** GENERATE WORDLIST **
$Wordlist->language = $strings['language'];
$Wordlist->characters = $strings['characters'];
$Wordlist->options = $options;

$return = $Wordlist->generate();

// ** RETURN OUTPUT **
header('Content-type: application/json');
print json_encode($return);