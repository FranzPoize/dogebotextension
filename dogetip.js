var modHash;

$.get('https://ssl.reddit.com/api/me.json').success(function(data) {
	modHash = data.data.modhash;
});

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

$('.comment .entry .buttons').each(function() {
	var userLink = $(this).parent().find('.tagline .author').attr('href'),
		fullname = $(this).parent().parent().parent().attr('data-fullname');
	if (userLink) {
		var urlArray = userLink.split('/'),
			username = urlArray[urlArray.length-1],
			dogetip = $('<li><a class="dogetip" style="cursor:pointer">dogetip</a></li>');

		$(this).append(dogetip);

		dogetip.click(function() {
			var element = $('<div class="dogetip-popup" style="position:absolute;"><input type="text" placeholder="Such amount !"></input>&nbsp;<img src="'+
				chrome.extension.getURL("images/dogecoin.png")+
				'" />&nbsp;<button class="send-doge-coin">send</button></div>')
				.css({left:this.offsetLeft+this.clientWidth,top:this.offsetTop-18}),
				input = $(element).find('input');
			$('body').append(element);

			input.focus().blur(function() {
				setTimeout(function() {
					$(element).remove();
				},200);
			});

			$(element).find('.send-doge-coin').click(function() {
				if (isNumber(input.val())) {
					$.ajax({
						url:'https://ssl.reddit.com/api/comment.json',
						type:'POST',
						contentType:'application/json',
						data: JSON.stringify({
							api_type:"json",
							text:"+/u/"+username+" "+input.val()+" doge",
							parent:fullname,
							uh:modHash
						}),
						headers: {
							'X-Modhash':modHash,
						}
					}).success(function() {
						console.log('success');
					}).error(function() {
						console.log('error');
					})
				}
			});
		})
	}
});