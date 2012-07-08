/**
 * Javascript for LibreText
 */
$(document).ready(function() {
	initializeLanguages();
	
	$('#generate').click(function() {
		submitForm();
		return false;
	});
	
	function initializeLanguages() {
		$.ajax({url: 'lib/languages.json', type:'GET', success: function(languages) {
			// Check that we got an object back. If the remote server
			// is misconfigured to return JSON as text/plain we need to
			// parse the JSON object manually.
			if(typeof languages !== "object") languages = $.parseJSON(languages);
			$.each(languages, function(index, language) {
				$('select[name=language] optgroup').append('<option value=' + index + '>' + language.name + '</option>');
			});
    }});		
	}
	
	function submitForm() {
		$.ajax({url: 'api/', type:'POST', data: $('#wordlistgenerator').serialize(), success: function(response) {
			if(typeof response !== "object") response = $.parseJSON(response);
			$('#wordlist').html('');
		  $.each(response.wordlist, function(index, data) {
				$('#wordlist').append(data + ' ');
			});
    }});
	}
});