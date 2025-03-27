class WhatsAppController{
    
    constructor(){
        

        //Métodos inicializadores
        this.elementsPrototype();
        this.loadElements();
        this.initEvents();
    }

    //Caregando todos elementos que tem um id e transformando em atributos da classe WhatsappController automaticamente e dinamicamente.
    loadElements(){
        
        this.el = {};
        document.querySelectorAll('[id]').forEach(element=>{

            this.el[Format.getCamelCase(element.id)] = element;

        });
    }

    elementsPrototype(){

        //Adicionando e removendo propriedades de forma dinâmica

        Element.prototype.hide = function(){
            this.style.display = 'none';
            return this;
        }

        Element.prototype.show = function(){
            this.style.display = 'block';
            return this;
        }

        Element.prototype.toggle = function(){
            this.style.display = (this.style.display === 'none') ? 'block' : 'none' ;
            return this;
        }

        //Adicionando e removendo eventos de forma dinâmica


        Element.prototype.on = function(events, fn){
            events.split(' ').forEach(event=>{
                this.addEventListener(event,fn);
            });
            return this;
        }

        //Adicionando e removendo estilos de forma dinâmica
        
        Element.prototype.css = function(styles){
            for(let name in styles){
                this.style[name] = styles[name];
            }
            return this;
        }

        Element.prototype.addClass = function(name){
            this.classList.add(name);
            return this;
        }

        Element.prototype.removeClass = function(name){
            this.classList.remove(name);
            return this;
        }

        Element.prototype.toggleClass = function(name){
            this.classList.toggle(name);
            return this;
        }

        Element.prototype.hasClass = function(name){
            return this.classList.contains(name);
        }
       
        //Retornando um FormData com os dados de quem o chama(this)
        HTMLFormElement.prototype.getForm = function(){
            return new FormData(this);
        }

        //Construindo um JSON pelo form data
        HTMLFormElement.prototype.toJSON = function(){
            let json = {};

            this.getForm().forEach((value, key)=>{

                json[key] = value;

            });

            return json;

        }




    }

    initEvents(){

        //Definindo os eventos usando os Prototypes no elementsPrototype()
        
        //Eventos do Painel a esquerda

        //Mostrar o perfil
        this.el.myPhoto.on('click', event =>{
            this.closeAllLeftPanel();
            this.el.panelEditProfile.show();

            setTimeout(()=>{
                this.el.panelEditProfile.addClass('open');
            }, 100);

        });

        //Adicionar uma nova foto de perfil
        this.el.photoContainerEditProfile.on('click', e=>{

            this.el.inputProfilePhoto.click();

        });

        //Adicionar um novo nome no perfil

        this.el.inputNamePanelEditProfile.on('keypress', e=>{

            if(e.key === 'Enter'){

                e.preventDefault();
                this.el.btnSavePanelEditProfile.click();

            }

        });

        //Trazer o que está no inputName do perfil ao clicar no btnSave
        this.el.btnSavePanelEditProfile.on('click', e=>{

            console.log(this.el.inputNamePanelEditProfile.innerHTML);

        });


        //Fechar o perfil
        this.el.btnClosePanelEditProfile.on('click', event =>{
            this.el.panelEditProfile.removeClass('open');
        });

        //Adicionar um novo contato
        this.el.btnNewContact.on('click', event =>{
            this.closeAllLeftPanel();
            this.el.panelAddContact.show();
            setTimeout(()=>{
                this.el.panelAddContact.addClass('open');
            }, 100);

        });

        //Capturando os dados no adicionar contato quando o botão submit é criado usando o Formdata
        this.el.formPanelAddContact.on('submit', e=>{
            e.preventDefault();
            //Construindo os dados com Formdata(passando id do elemento, os campos são construídos automaticamente)
            let formData = new FormData(this.el.formPanelAddContact);
            
        });

        //Fecha o adicionar um novo contato
        this.el.btnClosePanelAddContact.on('click', e=>{

            this.el.panelAddContact.removeClass('open');

        });


      
    }

    closeAllLeftPanel(){

        this.el.panelEditProfile.hide();
        this.el.panelAddContact.hide();

    }
  
}