/**
 * Javascript for LibreText
 */
$(function() {
	var displayCase = 'normal';
	var defaultPlaceholderText = 'AEiou';
	var enteredText = '';
	var processedText = '';

	var diacritics = {
	  "&Aacute;" : "A",
	  "&Acirc;" : "A",
	  "&Agrave;" : "A",
	  "&aacute;" : "a",
	  "&acirc;" : "a",
	  "&agrave;" : "a"
	};
		
	var Language = Backbone.Model.extend({});
	
	var Languages = Backbone.Collection.extend({
		model: Language,
		url: 'lib/languages.json'
	});

	var Languages = Backbone.Collection.extend({
		model: Language,
		url: 'lib/languages.json'
	});
	
	var AppView = Backbone.View.extend({
		el: $('body'),
		events: {
			'change select[name=language]': 'changeLanguage',
			'change input[name=transformcase],select[name=transformcaseto]': 'changeCase',
			'keyup input[name=characters]': 'generateWordlist',
			'click #characterEntry a': 'appendCharacter',
			'click #generate': 'clickGenerateWordlist',
			'click #options': 'generateWordlist',
			'change #options select': 'generateWordlist'
		},
		initialize: function() {
			$('input[name=characters]').attr('placeholder', defaultPlaceholderText);
			
			this.Languages = new Languages;
			this.Languages.bind("reset", this.render, this);
			this.Languages.fetch();
		},
		render: function() {
			this.Languages.each( function(model) {
			  $('select[name=language] optgroup[label=' + model.get('alphabet') + ']').append('<option>' + model.get('name') + '</option>');
			});
			this.changeLanguage();
		},
		changeLanguage: function() {
			value = $('select[name=language]').val();
			language = this.Languages.where({name: value})[0];

			language.get('punctuation') ? $('input[name=punctuation]').parent().show() : $('input[name=punctuation]').parent().hide();
			language.get('numbers') ? $('input[name=numbers]').parent().show() : $('input[name=numbers]').parent().hide();
			
			if(language.get('specialCharacters')) {
				$('#characterEntry').text('');
				$.each(language.get('specialCharacters'), function(index, data) {
					$('#characterEntry').append('<a class="btn" href="#">' + data + '</a>');
				});
				$('#characterEntry').parent().show();
			} else {
				$('#characterEntry').parent().hide();
			}
			
			return false;
		},
		appendCharacter: function(event) {
			if(!$(event.target).attr('disabled')) {
				value = $(event.target).text();
				$('input[name=characters]').val( $('input[name=characters]').val() + value );
				$(event.target).attr('disabled', true);
			}
			return false;
		},
		changeCase: function(event) {
			var _this = this;
			if(!$('input[name=transformcase]').is(':checked')) {
				_this.displayCase = 'normal';
			} else {
				_this.displayCase = $('select[name=transformcaseto]').val();
			}
			
			switch(_this.displayCase) {
				case 'upper':
					outputText = _this.enteredText.toUpperCase();
					break;
				case 'lower':
					outputText = _this.enteredText.toLowerCase();
					break;	
				case 'title':
					outputText = _this.enteredText.toProperCase();
					break;
				default:
					outputText = _this.enteredText;
					break;
			}

			_this.processedText = outputText;
		},
		trimDiacritics: function(event) {
			var _this = this;
			if(!$('input[name=trimdiacritics]').is(':checked')) {
				return;
			}			
			
			$.each(diacritics, function(encodedEntity, replacement) {
				var decoded = $("<div/>").html(encodedEntity).text();
				var decodedExpr = new RegExp(decoded, "g");
				_this.processedText = _this.processedText.replace(decodedExpr, replacement);
			});	
		},
		insertNumbers: function(event) {
			var _this = this;
			
			if(!$('input[name=numbers]').is(':checked')) {
				return;
			}			
			
			_this.processedText = _this.processedText.replace(/ /g, function($1) {
				numbers = language.get('numbers');

				// Insert numbers between approx (100-.75)*100 = 25% of the words
				if(Math.random() > .75) {
					var number = '';
					for(i=1; i<Math.floor(Math.random()*8); i++) {
						number = number + numbers[Math.floor(Math.random()*numbers.length)];
					}
					
					if(number.length) {
						$1 = ' ' + number + ' ';
					}
				}
				
				return $1;
			});
		},
		clickGenerateWordlist: function(event) {
			this.generateWordlist();
			return false;
		},
		generateWordlist: function(event) {
			var _this = this;
			
			$.ajax({url: 'api/', type:'POST', data: $('#wordlistgenerator').serialize(), success: function(response) {
				if(typeof response !== "object") response = $.parseJSON(response);
				
				_this.enteredText = '';
			  $.each(response.wordlist, function(index, data) {
					_this.enteredText = _this.enteredText + data + ' ';
				});
				
				_this.processedText = _this.enteredText;
				_this.changeCase();
				_this.trimDiacritics();
				_this.insertNumbers();
				$('#wordlist').html(_this.processedText);
	    }});
		}
	});
	
	var App = new AppView;
});

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};