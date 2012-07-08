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
			$.each(languages, function(index, language) {
				$('select[name=language] optgroup').append('<option value=' + index + '>' + language.name + '</option>');
			});
    }});		
	}
	
	function submitForm() {
		$.ajax({url: 'api/', type:'POST', data: $('#wordlistgenerator').serialize(), success: function(response) {
			$('#wordlist').html('');
		  $.each(response.wordlist, function(index, data) {
				$('#wordlist').append(data + ' ');
			});
    }});
	}
});