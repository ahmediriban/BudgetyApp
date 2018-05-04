var DataController = (function () {
    var Data = {
        obj:{
            incId : -1,
            expId : -1,
            inc:[],
            exp:[],
        },
        totales:{
            totalExp : 0,
            totalInc : 0,
        }
    }
    var incObj = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var expObj = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        //this.per = 0;
    }
    return{
         calculateTotal: function(){
             Data.totales.totalInc = 0;
             Data.totales.totalExp = 0;
             for(var i=0 ; i < Data.obj.inc.length ; i++){
                 Data.totales.totalInc += Data.obj.inc[i].value;
             }

             for(var i=0 ; i < Data.obj.exp.length ; i++){
                 Data.totales.totalExp += Data.obj.exp[i].value;
             }
         },
         insertObj: function (type, description, value) {
            var id ,obj;
            id = 0;
            if(type === 'inc'){
                id = Data.obj.incId + 1;
                obj = new incObj(id,description,value);
                Data.obj.inc.push(obj);
                Data.obj.incId++;
            }else if(type === 'exp'){
                id = Data.obj.expId + 1;
                obj = new expObj(id,description,value);
                Data.obj.exp.push(obj);
                Data.obj.expId++;
            }
            DataController.calculateTotal();
            return obj;
        },
        getIET: function() {
             return{
                 totalInc_: Data.totales.totalInc,
                 totalExp_: Data.totales.totalExp
             }
        },
        displayCons: function () {
            console.log(Data.totales.totalInc);
            console.log(Data.totales.totalExp);
        },
        removeObj: function (obj) {
             console.log(obj[0] === 'inc');
            if(obj[0] === 'inc'){
                for(var i = 0; i < Data.obj.inc.length;i++){
                    console.log(Data.obj.inc[i].id === parseInt(obj[1]));
                    if(Data.obj.inc[i].id === parseInt(obj[1])){
                        Data.obj.inc.splice(i,1);
                    }
                }
            }else {
                for(var i = 0; i < Data.obj.exp.length;i++){
                    console.log(Data.obj.exp[i].id === parseInt(obj[1]));
                    if(Data.obj.exp[i].id === parseInt(obj[1])){
                        Data.obj.exp.splice(i,1);
                    }
                }
            }
        },
        getPer: function () {
             var values = [];
            for(var i =0; i < Data.obj.exp.length;i++){
                values.push((Data.obj.exp[i].value / Data.totales.totalInc)*100);
            }
            return values;
        },
        getExp: function () {
            return Data.obj.exp;
        }
    }
})();







var UIController = (function () {
    var DOMsrtring = {
        type: '.add__type',
        description: '.add__description',
        value: '.add__value',
        incList: '.income__list',
        expList: '.expenses__list',
        salaryLabel: '.budget__value',
        incLabel: '.budget__income--value',
        expLabel: '.budget__expenses--value',
        addButton: '.add__btn',
        percentage:'.budget__expenses--percentage',
        container: '.container',
        month:'.budget__title--month'
    };
    function remove(){
        document.querySelector(DOMsrtring.description).value = '';
        document.querySelector(DOMsrtring.value).value = '';

    }
    return{
        updateUI: function (obj, type) {
            var html, totalInc, totalExp, newHtml, salary_ind, inc_ind, exp_ind;

            if(type === 'inc'){
                html = '<div class="item clearfix" id="inc-%id%">' +
                    '<div class="item__description">%itemDescripton%</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value">%itemValue%</div>' +
                    '<div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                newHtml = html.replace('%id%',obj.id);
                newHtml = newHtml.replace('%itemDescripton%',obj.description);
                newHtml = newHtml.replace('%itemValue%',UIController.changeFormatpos(obj.value));
                document.querySelector(DOMsrtring.incList).insertAdjacentHTML('beforeend', newHtml);
            }else if(type === 'exp'){
                html = '<div class="item clearfix" id="exp-%id%">\n' +
                    '<div class="item__description" >%itemDescripton%</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value">%itemValue%</div>' +
                    '<div class="item__percentage" id="per-%id%">21%</div>' +
                    '<div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                newHtml = html.replace('%id%',obj.id);
                newHtml = newHtml.replace('%itemDescripton%',obj.description);
                newHtml = newHtml.replace('%itemValue%',UIController.changeFormatneg(obj.value));
                newHtml = newHtml.replace('%id%',obj.id);
                document.querySelector(DOMsrtring.expList).insertAdjacentHTML('beforeend', newHtml);

            }

            //Calculate totales

            DataController.calculateTotal();

            //Update top
            totalInc = DataController.getIET().totalInc_;
            totalExp = DataController.getIET().totalExp_;

            if(totalInc-totalExp > 0){
                salary_ind = UIController.changeFormatpos(totalInc-totalExp);
            }else if (totalInc-totalExp < 0){
                salary_ind = UIController.changeFormatneg(Math.abs(totalInc-totalExp));
            }else {
                salary_ind = totalInc-totalExp;
            }

            if(totalInc > 0){
                inc_ind = UIController.changeFormatpos(totalInc);
            }else if (totalInc < 0){
                inc_ind = UIController.changeFormatneg(totalInc);
            }else {
                inc_ind = totalInc;
            }


            if(totalExp > 0){
                exp_ind = UIController.changeFormatneg(totalExp);
            }else if (totalExp < 0){
                exp_ind = UIController.changeFormatneg(totalExp);
            }else {
                exp_ind = totalExp;
            }




            document.querySelector(DOMsrtring.salaryLabel).textContent = salary_ind;
            document.querySelector(DOMsrtring.incLabel).textContent = inc_ind;
            document.querySelector(DOMsrtring.expLabel).textContent= exp_ind;
            document.querySelector(DOMsrtring.percentage).textContent = parseInt((totalExp/totalInc) * 100) + '%';

            //Remove pre-description & pre-value
            remove();

            //foucs at addDescription
            document.querySelector(DOMsrtring.description).focus();
        },
        startApp: function (obj) {
            document.querySelector(DOMsrtring.addButton).addEventListener('click',obj);
            document.addEventListener('keypress',function (e) {
                if(e.keyCode === 13 || e.which === 13){
                    obj();
                }
            })
        },
        getInput:function (){
            return{
                type : document.querySelector(DOMsrtring.type).value,
                description : document.querySelector(DOMsrtring.description).value,
                value : parseFloat(document.querySelector(DOMsrtring.value).value)
            };
        },
        initUpdate: function () {
            document.querySelector(DOMsrtring.salaryLabel).textContent = '0';
            document.querySelector(DOMsrtring.incLabel).textContent = '0';
            document.querySelector(DOMsrtring.expLabel).textContent= '0';
            document.querySelector(DOMsrtring.percentage).textContent= '---';
        },
        remove: function (event) {
            var el, elSplit, totalInc, totalExp, inp, salary_ind, inc_ind, exp_ind;
            el = event.target.parentNode.parentNode.parentNode.parentNode.id;
            inp =  document.getElementById(el);
            if(el){
                if(el !== null){
                    elSplit = el.split('-');
                }
                DataController.removeObj(elSplit);
                DataController.calculateTotal();
                console.log(el);

                inp.parentNode.removeChild(inp);






                //Update top
                totalInc = DataController.getIET().totalInc_;
                totalExp = DataController.getIET().totalExp_;

                if(totalInc-totalExp > 0){
                    salary_ind = UIController.changeFormatpos(totalInc-totalExp);
                }else if (totalInc-totalExp < 0){
                    salary_ind = UIController.changeFormatneg(Math.abs(totalInc-totalExp));
                }else {
                    salary_ind = totalInc-totalExp;
                }

                if(totalInc > 0){
                    inc_ind = UIController.changeFormatpos(totalInc);
                }else if (totalInc < 0){
                    inc_ind = UIController.changeFormatneg(totalInc);
                }else {
                    inc_ind = totalInc;
                }

                if(totalExp > 0){
                    exp_ind = UIController.changeFormatneg(totalExp);
                }else if (totalExp < 0){
                    exp_ind = UIController.changeFormatneg(totalExp);
                }else {
                    exp_ind = totalExp;
                }



                document.querySelector(DOMsrtring.salaryLabel).textContent = salary_ind;
                document.querySelector(DOMsrtring.incLabel).textContent = inc_ind;
                document.querySelector(DOMsrtring.expLabel).textContent= exp_ind;
                document.querySelector(DOMsrtring.percentage).textContent = parseInt((totalExp/totalInc) * 100) + '%';

                //Upadata per
                UIController.updatePer();
            }
        },
        applyRemove: function () {
            document.querySelector(DOMsrtring.container).addEventListener('click',UIController.remove);
        },
        updatePer: function () {
            console.log(DataController.getIET());
            for(var i = 0;i < DataController.getPer().length;i++){
                document.getElementById('per-'+DataController.getExp()[i].id).textContent = parseInt(DataController.getPer()[i]) + '%';
            }
            console.log(DataController.getIET());
        },
        updateMY: function () {
            var date, year, month;

            date = new Date();
            year = date.getFullYear();
            month = date.getMonth();

            switch (month){
                case 0:
                    month = 'january';
                    break;
                case 1:
                    month = 'February';
                    break;
                case 2:
                    month = 'March';
                    break;
                case 3:
                    month = 'April';
                    break;
                case 4:
                    month = 'May';
                    break;
                case 4:
                    month = 'June';
                    break;
                case 6:
                    month = 'Jule';
                    break;
                case 7:
                    month = 'August';
                    break;
                case 8:
                    month = 'September';
                    break;
                case 9:
                    month = 'October';
                    break;
                case 10:
                    month = 'November';
                    break;
                case 11:
                    month = 'December';
                    break;
            }

            document.querySelector(DOMsrtring.month).textContent = month + ' ' + year;
        },
        changeFormatpos: function (number) {
            return '+' + numeral(number).format('0,0.0');
        },
        changeFormatneg: function (number) {
            return '-' +numeral(number).format('0,0.0');
        },
        changeBorder: function () {
            var exp;
            //exp =
            console.log(true);
            if(document.querySelector(DOMsrtring.type).value === 'exp'){
                document.querySelector(DOMsrtring.description).classList.add('red-focus');
                document.querySelector(DOMsrtring.value).classList.add('red-focus');
                document.querySelector(DOMsrtring.type).classList.add('red-focus');
                document.querySelector('.ion-ios-checkmark-outline').classList.add('red');
            }
            if(document.querySelector(DOMsrtring.type).value === 'inc'){
                document.querySelector(DOMsrtring.description).classList.remove('red-focus');
                document.querySelector(DOMsrtring.value).classList.remove('red-focus');
                document.querySelector(DOMsrtring.type).classList.remove('red-focus');
                document.querySelector('.ion-ios-checkmark-outline').classList.remove('red');
            }
        },
        applyChangeBorder: function () {
            document.querySelector(DOMsrtring.type).addEventListener('click',UIController.changeBorder);
            console.log(true);
        }

    }
})();




var Controller = (function (UICont, DataCont) {
    function insertItem() {
        var item, obj, expression;
        expression = UICont.getInput().description !== '' && !isNaN(UICont.getInput().value)
            && UICont.getInput().value > 0 && isNaN(UICont.getInput().description);
        //Get input from UIController
        if(expression){
            item = {
                type: UICont.getInput().type,
                description: UICont.getInput().description,
                value: UICont.getInput().value
            }
            //Insert item into DataController
            obj = DataCont.insertObj(item.type,item.description,item.value);
            //Updata UI
            UICont.updateUI(obj, item.type);

            UICont.updatePer();

            DataCont.displayCons();
        }
    }
    return{
        init : function () {
            console.log('App is starting ...');
            UICont.initUpdate();
            UICont.startApp(insertItem);
            UICont.applyRemove();
            UICont.updateMY();
            UICont.applyChangeBorder();
        }
    }
})(UIController, DataController);

Controller.init();
