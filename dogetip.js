var modHash;



function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function doDogeTiping() {
	var userLink = $(this).parent().find('.tagline .author').attr('href'),
		fullname = $(this).parent().parent().parent().attr('data-fullname') || $(this).parent().parent().attr('data-fullname');
	if (userLink) {
		var urlArray = userLink.split('/'),
			username = urlArray[urlArray.length-1],
			dogetip = $('<li><a class="dogetip doge-tip" style="cursor:pointer">dogetip</a></li>');

		$(this).append(dogetip);

		dogetip.click(function() {
			$('.dogetip-popup').remove();
			var element = $('<div class="dogetip-popup doge-tip" style="position:absolute;">'+
					'<div class="dogetip-popup-before"></div>'+
					'<div class="dogetip-popup-after"></div>'+
					'<div class="doge-header">'+
						'<img src="'+chrome.extension.getURL("images/dogecoin.png")+'" />'+
					'</div>'+
					'<div class="doge-body">'+
						'<input class="doge-amount doge-tip" type="text" placeholder="Such amount !"></input>'+
						'&nbsp;<button class="send-doge-coin doge-tip">Send</button>'+
					'</div>'+
				'</div>')
				.css({left:this.offsetLeft+this.clientWidth+25,top:this.offsetTop-18}),
				input = $(element).find('input');
			$('body').append(element);

			input.focus()
			$(document).click(function(e) {
				if(!$(e.target).hasClass('doge-tip')) {
					setTimeout(function() {
						abortMoonMission()
					},200);
				}
			});
			var btn = $(element).find('.send-doge-coin');

			function sendDogeCoin () {
				if (isNumber(input.val())) {
					$.get('http://www.reddit.com/api/me.json').success(function(data) {
					modHash = data.data.modhash;
					var form = $('<form>').
							append($('<input>').attr({name:'api_type',value:'json'})).
							append($('<input>').attr({name:'text',value:"+/u/dogetipbot "+input.val()+" doge"})).
							append($('<input>').attr({name:'thing_id',value:fullname})).
							append($('<input>').attr({name:'uh',value:modHash}))
					$.ajax({
						url:'http://www.reddit.com/api/comment',
						type:'POST',
						data: form.serialize()
					}).success(function() {
						btn.text('Sent').css('background-color','#33f572');
						setTimeout(function() {
							abortMoonMission()
						},1000)
					}).error(function() {
						btn.text('Error').css('background-color','#f52323');
						setTimeout(function() {
							btn.text('Send').css('background-color','rgb(240, 240, 240)');
						},1000)
					})
					});	
				}
			}

			function abortMoonMission() {
				$(element).remove();
				$(document).off('keydown');
			}
			
			$(document).on('keydown',function(e) {
				if (e.keyCode == 27) {
			       abortMoonMission()
			    } else if (e.keyCode == 13) {
			        sendDogeCoin()
			    }
			})
			btn.click(sendDogeCoin);

		})
	}
}
$('.content .entry .buttons').each(doDogeTiping);