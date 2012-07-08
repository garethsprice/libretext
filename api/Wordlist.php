<?php
/**
 * Class to generate wordlists containing a given character set
 */
class Wordlist {
  public $language = NULL;
  public $characters = NULL;
  public $options = array(
    'punctuation' => FALSE, 
    'numbers' => FALSE, 
    'trimdiacritics' => FALSE, 
    'ignorecase' => FALSE, 
    'startuppercase' => FALSE, 
    'transformcase' => FALSE, 
    'transformcaseto' => FALSE,
    'resultlimit' => 1000,
    'minlength' => 2,
    'maxlength' => 32,
  );
  
  /**
   * Return array containing wordlist, timestamp and benchmark
   */
  public function generate() {
    $filepath = 'wordlists/' . $this->language . '.txt';
    
    if(!is_readable($filepath)) {
      return array('error' => 'Could not open wordlist for language ' . $this->language);
    }
    $file = file($filepath);
    
    $regex = '/^[' . $this->characters . ']{' . $this->options['minlength'] . ',' . $this->options['maxlength'] . '}$/u';
    if($this->options['ignorecase']) $regex .= 'i';
    
    // Use microtime to record execution time for benchmarking
    $time_start = microtime(TRUE);
    // Return the first N results from the grep, stripping keys showing line number
    $wordlist = array_slice(array_values(preg_grep($regex, $file)), 0, $this->options['resultlimit']);
    $benchmark = microtime(TRUE) - $time_start;
    
    return array(
      'timestamp' => time(),
      'generated_in' => $benchmark,
      'wordlist' => $wordlist
    );
  }
}