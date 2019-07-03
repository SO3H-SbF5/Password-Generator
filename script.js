$(document).ready(function(){
	console.info("File loaded");

	/* Default settings */
	__nb_words = 3;
	__min_lenght = 4;
	__max_lenght = 8;
	__characters = '!@$%^&*-_+=:|~?/.;';
	__character = '-';
	__padding = 2;

	/* Generating selectiors options */
	console.info("Appending options to form");
	for(var i = 2 ; i <= 10 ; i++){
		$('select#nb_words').append(new Option(i, i, (i==__nb_words)?true:false, (i==__nb_words)?true:false));
	}

	for(var i = 4 ; i <= 10 ; i++){
		$('select#min_lenght').append(new Option(i, i, (i==__min_lenght)?true:false, (i==__min_lenght)?true:false));
		$('select#max_lenght').append(new Option(i, i, (i==__max_lenght)?true:false, (i==__max_lenght)?true:false));
	}

	for(var i = 0 ; i <= 5 ; i++){
		$('select#padding_before').append(new Option(i, i, (i==__padding)?true:false, (i==__padding)?true:false));
	}

	/* Waiting for change in selectors to change input characters */
	$('select#separator').change(function(){
		//console.log("Selection changed");

		value = $(this).val();

		if(value == 'RANDOM')
			$('input#characters').val(__characters);
		else 
			$('input#characters').val(__character);
	});

	$('select#padding_type').change(function(){
		//console.log("Selection changed");

		value = $(this).val();

		if(value == 'RANDOM')
			$('input#padding_characters').val(__characters);
		else 
			$('input#padding_characters').val(__character);
	});


	/* On submit */
	$('form#settings').submit(function(e){
		/* Hiding buttons and textarea, showing loading bar */
		
		progress(0);

		//console.time("show/hide");

		$("#result").hide();
		$("#button").attr("disabled", true);
		$("#progress").show();

		e.preventDefault();

		//console.timeEnd("show/hide");

		progress(4.09);

		console.info("Form submited");

		//console.time("load");

		if($('#dico').text()=="imempty"){
			//console.log("Library loading");

			$('#dico').load("liste.txt");
		}

		//console.log("Reading library");
		var dico = $('#dico').text();
		var liste = dico.split("\n");

		//console.timeEnd("load");

		progress(8.34);


		$("#result").val("Please wait...");

		if(liste[0]!="ATM"){
			//console.time("reload");
			console.warn("Load failed, reading again");

			setTimeout(function (){
				var dico = $('#dico').text();
				var liste = dico.split("\n");

				//console.timeEnd("reload");
				generate(liste);
			}, 2000);
		}
		else
			generate(liste);

		return false;
	});

	function generate(liste){
		progress(75.84);

		console.info("Generation !");

		//console.time("init");
		var result = "";
		var words = new Array();

		var nb_words = $('select#nb_words').val();
		var min_lenght =  $('select#min_lenght').val();
		var max_lenght =  $('select#max_lenght').val();
		var transformation =  $('select#transformation').val();
		var padding_type = $('select#padding_type').val();
		var separator = $('select#separator').val();
		var padding_before = $('select#padding_before').val();
		var pwd_nb = $('select#pwd_nb').val();


		//console.timeEnd("init");
		progress(79.87);

		var i = 0;

		//console.log("Choosing words");
		//console.time("words");
		while(i < nb_words){
			var word = '';
			var iterations = 1;
			do{
				word = liste[Math.floor(Math.random() * liste.length)];
				iterations++;
			} while( ((word.length < min_lenght) || (word.length > max_lenght)) && (iterations < 1000));

			if(iterations >= 1000) return false;

			words.push(word);
			i++;
		}
		//console.timeEnd("words");
		progress(84);

		

		//console.log("Transformation");
		//console.time("transo");
		var alternate = 0;
		for(var i = 0 ; i < words.length ; i++){
			switch(transformation){
				case "ALTERNATE":
					if(alternate==1)
						words[i] = words[i].toUpperCase();
					else
						words[i] = words[i].toLowerCase();

					alternate = (alternate + 1) % 2;
					break;
				case "CAPITALISE":
					words[i].toLowerCase();
					words[i] = words[i][0].toUpperCase() + words[i].substr(1);
					break;
				case "INVERT":
					words[i] = words[i][0].toLowerCase() + words[i].substr(1).toUpperCase();
					break;
				case "UPPER":
					words[i] = words[i].toUpperCase();
					break;
				case "RANDOM_WORD":
					alternate = Math.floor(Math.random() * 2);
					if(alternate==1)
						words[i] = words[i].toUpperCase();
					else
						words[i] = words[i].toLowerCase();

				case "RANDOM_LETTER":
					sentence = words[i].split("");

					for(var j = 0 ; j < sentence.length ; j++){
						alternate = Math.floor(Math.random() * 2);
						if(alternate==1){
							sentence[j] = sentence[j].toUpperCase();
						}
						else
							sentence[j] = sentence[j].toLowerCase();
					}

					words[i] = sentence.join("");
					break;
				case "LOWER":
				default:
					words[i] = words[i].toLowerCase();
					break;
			}
		}

		//console.timeEnd("transo");
		progress(88);
		//console.time("padding");
		//console.log("Padding left");
		paddings = new Array();

		if(padding_type == "SPECIFIED"){
			sp = $("input#padding_characters").val()[0];
			paddings.push(sp);
		}
		else{
			sp = $("input#padding_characters").val().split('');
			paddings = sp;
		}


		padding_array = new Array();

		for(var i = 0 ; i < padding_before ; i++){
			if(padding_type == "SPECIFIED")
				add = paddings[0];
			else
				add = paddings[Math.floor(Math.random() * paddings.length)];
			
			padding_array.push(add);

			result = result + add;
		}

		//console.timeEnd("padding");
		progress(92);
		//console.time("parsing");

		//console.log("Words & Separator");

		separators = new Array();

		if(separator == "SPECIFIED"){
			separators = $("input#characters").val().split('');
		}
		else{
			separators = $("input#characters").val().split('');
		}

		for(var i = 0 ; i < words.length ; i++){
			if(padding_type == "SPECIFIED")
				add = separators.join('');
			else
				add = separators[Math.floor(Math.random() * separators.length)];

			if(i>0)
				result = result + add + words[i];
			else
				result = result + words[i];
		}

		//console.timeEnd("parsing");
		progress(96);

		//console.log("Padding right");		

		for(var i = 0 ; i < padding_before ; i++){
			add = padding_array.pop();
			
			result = result + add;
		}

		//console.log("Result : " + result);


		progress(100);

		//console.time("result");
		$('#result').val(result);
		//console.log("Done.");

		$("#button").attr("disabled", false);
		$("#result").show();

		setTimeout(function(){
			$("#progress").hide();
		}, 1000);

		//console.timeEnd("result");
	}


	function progress(value){
		$('#progressbar').css("width", value + "%");
		$('#progressbar').attr("aria-valuenow", value);

		return;
	}
});