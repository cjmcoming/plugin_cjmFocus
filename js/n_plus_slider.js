function Focus(o) {
	this.conBox = o.conBox;
	this.con = o.con;
	this.tab = o.tab || false;
	this.conCur = o.conCur || "cur";
	this.tabCur = o.tabCur || "cur";
	this.btnL = o.btnL || undefined;
	this.btnR = o.btnR || undefined;
	this.numShow = o.numShow || 1;
	this.type = o.type || "scroll";
	this.numScroll = o.numScroll || this.tab.eq(0).width();
	this.loop = o.loop || false;
	if(this.loop) {this.loopType = o.loopType || "seamless";}
	this.auto = o.auto || false;
	this.numDelay = o.numDelay || 5000;
	this.numIndex = o.numIndex || 0;

	this.numLen = this.con.length;
	if(this.numLen <= this.numShow) {return;}
	if(this.auto) {this.pause = false;}
	if(this.numShow > 1) {
		this.type = "scroll";
		if(this.tab) {
			this.tab.parent().hide();
			this.tab = false;
		}
	};
	if(this.tab) {this.tab.eq(this.numIndex).addClass(this.tabCur);}
	this.numNow = this.numIndex;
	this.numMin = 0;
	this.numMax = this.numLen - 1;
	this.moving = false;
	this.init();
}
Focus.prototype = {
	init:function() {
		var _self = this;
		if(_self.type == "scroll") {
			_self.initScroll();
		}else if(_self.type == "fade") {
			_self.initFade();
		}
		if(_self.auto) {
			_self.conBox.mouseover(function(){_self.pause = true;});
			_self.conBox.mouseout(function(){_self.pause = false;});
			if(_self.tab) {
				_self.tab.mouseover(function(){_self.pause = true;});
				_self.tab.mouseout(function(){_self.pause = false;});
			}
			if(_self.btnL) {
				_self.btnL.mouseover(function(){_self.pause = true;});
				_self.btnL.mouseout(function(){_self.pause = false;});
			}
			if(_self.btnR) {
				_self.btnR.mouseover(function(){_self.pause = true;});
				_self.btnR.mouseout(function(){_self.pause = false;});
			}
		};
	},
	initScroll:function() {
		var _self = this;
		if(_self.loop && _self.loopType=="seamless") {
			var temHtml = _self.conBox.html();
			_self.conBox.html(temHtml+temHtml+temHtml);
			_self.numNow = _self.numLen + _self.numNow;
			_self.numMax = _self.numLen * 2;
			_self.numMin = _self.numLen - _self.numShow;
			_self.conBox.css({"width":_self.numScroll*(this.numLen*3),"left":-_self.numScroll*(_self.numNow)});
		}else{
			_self.conBox.css({"width":_self.numScroll*this.numLen,"left":-_self.numScroll*_self.numNow});
		}
		_self.btnL.click(function() {_self.movieScroll(_self.numNow-1);});
		_self.btnR.click(function() {_self.movieScroll(_self.numNow+1);});
		if(_self.tab) {
			_self.tab.each(function(i){
				$(this).click(function(){
					_self.movieScroll(i);
				});
			});
		}
		if(_self.auto) {
			setInterval(function(){
				if(!_self.pause) {
					_self.movieScroll(_self.numNow+1);
				}
			},_self.numDelay);
		};
	},
	initFade:function() {
		var _self = this;
		_self.con.css("opacity",0);
		_self.con.eq(_self.numIndex).css("opacity",1).addClass(_self.conCur);
		_self.btnL.click(function() {_self.movieFade(_self.numNow-1);});
		_self.btnR.click(function() {_self.movieFade(_self.numNow+1);});
		if(_self.tab) {
			_self.tab.each(function(i){
				$(this).click(function(){
					_self.movieFade(i);
				});
			});
		}
		if(_self.auto) {
			setInterval(function(){
				if(!_self.pause) {
					_self.movieFade(_self.numNow+1);
				}
			},_self.numDelay);
		};
	},

	movieScroll:function(numNew) {
		var _self = this;
		if(!_self.moving) {
			var numLeft;
			if(_self.loop) {
				if(_self.loopType=="seamless") {
					numNew = numNew > _self.numMax ? _self.numMin : numNew;
					numNew = numNew < _self.numMin ? _self.numMax : numNew;
					if (numNew != _self.numNow) {
						numLeft = - _self.numScroll * numNew;
						_self.moving = true;
						_self.conBox.animate({"left":numLeft},500,function() {
							if(numNew == _self.numMax) {
								_self.conBox.css("left",-_self.numScroll*_self.numLen);
							}else if(numNew == _self.numMin) {
								_self.conBox.css("left",-_self.numScroll*(_self.numLen*2-_self.numShow) );
							}
							_self.moving = false;
						});
						if(numNew == _self.numMax) {
							_self.numNow = _self.numLen;
							_self.numIndex = 0;
						}else if(numNew == _self.numMin) {
							_self.numNow = _self.numLen*2 - _self.numShow;
							_self.numIndex = _self.numLen - _self.numShow
						}else{
							_self.numNow = numNew;
							if(_self.numNow < _self.numLen) {
								_self.numIndex = _self.numNow;
							}else if(_self.numNow > 2*_self.numLen) {
								_self.numIndex = _self.numNow - 2*_self.numLen;
							}else{
								_self.numIndex = _self.numNow - _self.numLen;
							}
						}
					}
				}else if(_self.loopType=="simple") {
					numNew = numNew > (_self.numMax) ? 0 : numNew;
					numNew = numNew < 0 ? (_self.numLen-1) : numNew;
					if (_self.numNow != numNew) {
						numLeft = - _self.numScroll * numNew;
						_self.moving = true;
						_self.conBox.animate({"left":numLeft},500,function() {
							_self.moving = false;
						});
						self.numIndex = _self.numNow = numNew;
					}
				}
			}else{
				numNew = numNew > (_self.numLen-1) ? (_self.numLen-1) : numNew;
				numNew = numNew < 0 ? 0 : numNew;
				if (_self.numNow != numNew) {
					numLeft = - _self.numScroll * numNew;
					_self.moving = true;
					_self.conBox.animate({"left":numLeft},500,function() {
						_self.moving = false;
					});
					self.numIndex = _self.numNow = numNew;
				}
			}
			if(_self.tab) {
				_self.tab.parent().find("."+_self.tabCur).removeClass(_self.tabCur);
				_self.tab.eq(_self.numIndex).addClass(_self.tabCur);
			}
		}
	},

	movieFade:function(numNew) {
		var _self = this;
		if(!_self.moving) {
			numNew = numNew > _self.numMax ? _self.numMin : numNew;
			numNew = numNew < _self.numMin ? _self.numMax : numNew;
			if(numNew != _self.numNow) {
				_self.con.eq(numNew).css({"display":"block"});
				_self.moving = true;
				_self.con.eq(_self.numNow).animate({"opacity":0},500);
				_self.con.eq(numNew).animate({"opacity":1},500,function() {
					_self.moving = false;
				});
				_self.numIndex = _self.numNow = numNew;
				if(_self.tab) {
					_self.tab.parent().find("."+_self.tabCur).removeClass(_self.tabCur);
					_self.tab.eq(_self.numIndex).addClass(_self.tabCur);
				}
			}
		}
	}
};