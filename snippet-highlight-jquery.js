/**
 * Eric Olson
 * https://github.com/zpalffy/snippet-highlight-jquery * 
 * License: MIT - http://opensource.org/licenses/MIT
 */
(function($) {

	function error(msg, val) {
 		if (typeof console !== 'undefined') console.error(msg, val);
 	}

 	function loadPastebin(ele, owner, id) {
 		if (id) {
 			ele.load('http://pastebin.com/raw.php', {i: id}, function() {
 				owner.removeClass('loading');
 			});
 			highlight(ele);
 			owner.trigger('snippetLoaded', {type: 'pastebin', 'id': id});
 		}
 	};

 	function loadGist(ele, owner, id, opts) {
 		if (id) {
 			$.get('https://api.github.com/gists/' + id, function(d) {
 				//var file = d.files[owner.data('filename') || 'gistfile1.txt'];
 				var file = owner.data('filename');
 				if (!file) {
 					for (var i in d.files) {
 						if (!file) {
 							file = i;
 						} else {
 							file = null;
 							error('More than one file exists for gist id: %s, add a data-filename element to specify which file you want to display.', id);
 							break;
 						}
 					}
 				}

 				file = d.files[file];
 				owner.removeClass('loading');

 				if (file) { 					
 					ele.text(file.content);
 					highlight(ele);
 					file.type = 'gist';
 					owner.trigger('snippetLoaded', file);
 				} else {
 					owner.addClass(opts.errorClass);
 				}
 			});
 		}
 	};

 	function highlight(ele) {
		if (typeof hljs != 'undefined') {
			hljs.highlightBlock(ele.get(0));
		}
 	};

	$.fn.snippetMarkup = function(options) {
		var opts = $.extend({
            errorClass: 'error'
        }, options);

		$(this).each(function() {
			var $this = $(this);
			$this.addClass('loading');
			var code = $('<code>').appendTo($('<pre>').appendTo($this));
			if ($this.data('language')) {
				code.addClass($this.data('language'));
			}
			
			loadPastebin(code, $this, $this.data('pastebinId'));
			loadGist(code, $this, $this.data('gistId'), opts);
		});
		
		return this;
	};

	$.loadSnippetsOnLoad = function() {
		$(document).ready(function() {
			$('[data-pastebin-id], [data-gist-id]').snippetMarkup();
		});
	}
})(jQuery);