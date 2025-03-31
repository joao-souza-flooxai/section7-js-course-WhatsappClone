
import {Format} from './../util/format';
import {CameraController} from "./CameraController";
import {MicrophoneController} from "./MicrophoneController";
import {DocumentPreviewController} from './DocumentPreviewController';
import { Firebase } from './../util/Firebase';
import { User } from './../model/User';

export class WhatsAppController{
    
    constructor(){
        

        //Métodos inicializadores
        this._fireabse = new Firebase();
        this.initAuth();
        this.elementsPrototype();
        this.loadElements();
        this.initEvents();
       
    }
    
    initAuth(){
        this._fireabse.initAuth()
            .then((response)=>{

                this._user = new User();

                let userRef  = User.findByEmail(response.user.email);

                userRef.set({
                    name: response.user.displayName,
                    email: response.user.email,
                    photo: response.user.photoURL
                }).then(()=>{
                    this.el.appContent.css({
                        display: 'flex'
                    });
                });

                
            })
            .catch(err=>{
                console.error(err);
            });
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

        /*
            Eventos de Perfil
        */

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

        
        /*
            Eventos de Adicionar um novo contato
        */


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

        /*
            Eventos do Chat
        */

        //Adicionando um evento a cada chat dos contatos que aparecem(classe ".contact-item").
        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item=>{

            item.on('click', e=>{
                //Adicionando um evento para aquele contato especifico mostrando o chat e ocultando outros paineis.
                this.el.home.hide();
                this.el.main.css({
                    display: 'flex'
                });

            });

        });

        //Eventos do Painel da direita
        
        //Adicionando um evento no botão de anexo, abrindo as opções
        this.el.btnAttach.on('click', e=>{

            e.stopPropagation();
            this.el.menuAttach.addClass('open');
            document.addEventListener('click', this.closeMenuAttach.bind(this));

        });

        //Evento no botão de anexo, photo

        this.el.btnAttachPhoto.on('click', e=>{
            this.el.inputPhoto.click();
        });

        this.el.inputPhoto.on('change', e=>{
            [...this.el.inputPhoto.files].forEach(file=>{

            });
        });

        //Evento no botão de anexo, camera

        this.el.btnAttachCamera.on('click', e=>{
            this.closeAllMainPanel()
            this.el.panelCamera.addClass('open');
            this.el.panelCamera.css({
              'height': 'calc(100% - 10px)' //alterado do video(120px) ve se isso nao vai dar problema
            });
      
            this._camera = new CameraController(this.el.videoCamera);
          });
      
          this.el.btnClosePanelCamera.on('click', e=>{
                this.closeAllMainPanel();
                this.el.panelMessagesContainer.show();
                this._camera.stop();
          })
      
        this.el.btnTakePicture.on('click', e=>{
                let dataUrl = this._camera.takePicture();
                
                //Manipulando os elementos da tela
                this.el.pictureCamera.src = dataUrl;
                this.el.pictureCamera.show();
                this.el.videoCamera.hide();
                this.el.btnReshootPanelCamera.show();
                this.el.containerTakePicture.hide();
                this.el.containerSendPicture.show();
          });

        this.el.btnReshootPanelCamera.on('click', e=>{
            this.el.pictureCamera.hide();
            this.el.videoCamera.show();
            this.el.btnReshootPanelCamera.hide();
            this.el.containerTakePicture.show();
            this.el.containerSendPicture.hide();
        });

        this.el.btnSendPicture.on('click', e=>{
            console.log(this.el.pictureCamera.src);
        });


        //Evento no botão de anexo, document

        this.el.btnAttachDocument.on('click', e=>{
            this.closeAllMainPanel();
            this.el.panelDocumentPreview.addClass('open');
            this.el.panelDocumentPreview.css({
                'height': 'calc(100% - 10px)' //alterado do video(120px) ve se isso nao vai dar problema
              });

            this.el.inputDocument.click();

        });

        this.el.inputDocument.on('change', e=>{

            if(this.el.inputDocument.files.length){
                
                this.el.panelDocumentPreview.css({
                    'height': '1%' //alterado do video(120px) ve se isso nao vai dar problema
                  });
                
                let file = this.el.inputDocument.files[0];
                
                this._documentPreviewController = new DocumentPreviewController(file);
                this._documentPreviewController.getPreviewData().then(result=>{

                    this.el.imgPanelDocumentPreview.src = result.src;
                    this.el.infoPanelDocumentPreview.innerHTML = result.info;
                    this.el.imagePanelDocumentPreview.show();
                    this.el.filePanelDocumentPreview.hide();

                    this.el.panelDocumentPreview.css({
                        'height': 'calc(100% - 10px)' //alterado do video(120px) ve se isso nao vai dar problema
                      });

                }).catch(err=>{

                    this.el.panelDocumentPreview.css({
                        'height': 'calc(100% - 10px)' //alterado do video(120px) ve se isso nao vai dar problema
                      });

                    switch(file.type){
                        
                        case 'application/vnd.ms-excel':
                        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls';
                        break;

                        case 'application/vnd.ms-powerpoint':
                        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
                        break;

                        case 'application/msword':
                        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
                        break;

                        default:
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
                        break;


                    }
                    this.el.filenamePanelDocumentPreview.innerHTML = file.name;
                    this.el.imagePanelDocumentPreview.hide();
                    this.el.filePanelDocumentPreview.show();

                });
            }

        });

        this.el.btnClosePanelDocumentPreview.on('click', e=>{
            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();
        });


        this.el.btnSendDocument.on('click', e=>{
            console.log('send document');
        });


        //Evento no botão de anexo, contact

        this.el.btnAttachContact.on('click', e=>{

            this.el.modalContacts.show();
        });

        this.el.btnCloseModalContacts.on('click', e=>{

            this.el.modalContacts.hide();
        });

        /*
            Eventos da parte inferior direita: chat, emoji e audio
        */

        //Audio

        this.el.btnSendMicrophone.on('click', ev=>{
            this.el.recordMicrophone.show();
            this.el.btnSendMicrophone.hide();

            this._microphoneController = new MicrophoneController();

            this._microphoneController.on('ready', audio=>{
                console.log('ready', audio);
                this._microphoneController.startRecorder();
            });

            this._microphoneController.on('recordtimer', timer=>{
                this.el.recordMicrophoneTimer.innerHTML = Format.toTime((timer));
            });


        });

        this.el.btnCancelMicrophone.on('click', ev=>{
            this.closeRecordMicrophone();
            this._microphoneController.stopRecorder();
        });

        this.el.btnFinishMicrophone.on('click', ev=>{
            this.closeRecordMicrophone();
            this._microphoneController.stopRecorder();
        });

        //Texto

        this.el.inputText.on('keypress', e=>{
            
            if(e.key == 'Enter' && !e.ctrlKey){
                e.preventDefault();
                this.el.btnSend.click();
            }
        
        });

        this.el.inputText.on('keyup', ev=>{

            if(this.el.inputText.textContent.length || this.el.inputText.querySelector('img')){

                this.el.inputPlaceholder.hide();
                this.el.btnSendMicrophone.hide();
                this.el.btnSend.show();

            }else{
                this.el.inputPlaceholder.show();
                this.el.btnSendMicrophone.show();
                this.el.btnSend.hide();
            }


        });

        this.el.btnSend.on('click', e=>{
            console.log(this.el.inputText.innerHTML);
        });

        //Emoji

        this.el.btnEmojis.on('click', e=>{
            this.el.panelEmojis.toggleClass('open');
        });

        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji=>{
            emoji.on('click', e=>{
                console.log(emoji.dataset.unicode);
                let img = this.el.imgEmojiDefault.cloneNode();
                
                img.style.cssText = emoji.style.cssText;
                img.dataset.unicode = emoji.dataset.unicode;
                img.alt = emoji.dataset.unicode;

                emoji.classList.forEach(name=>{
                    img.classList.add(name);
                });


                let cursor = window.getSelection();
                let inputText = this.el.inputText; 

                // Garantir que a seleção esteja dentro do inputText
                if (!cursor.focusNode || !inputText.contains(cursor.focusNode)) {
                    inputText.focus();
                    cursor = window.getSelection();
                }

                // Criar um range válido apenas dentro do inputText
                let range = cursor.rangeCount ? cursor.getRangeAt(0) : document.createRange();

                // Se o range não pertence ao inputText, redefinir para o final dele
                if (!inputText.contains(range.commonAncestorContainer)) {
                    range.selectNodeContents(inputText);
                    range.collapse(false); // Move o cursor para o final do inputText
                }

                // Remover qualquer conteúdo selecionado antes de inserir o emoji
                range.deleteContents();

                // Criar o fragmento e inserir o emoji corretamente
                let frag = document.createDocumentFragment();
                frag.appendChild(img);

                range.insertNode(frag);
                range.setStartAfter(img);

                // Atualizar a seleção para depois do emoji inserido
                cursor.removeAllRanges();
                cursor.addRange(range);

                this.el.inputText.dispatchEvent(new Event('keyup'));

            });
        });


    }

    closeRecordMicrophone(){
        this.el.recordMicrophone.hide();
        this.el.btnSendMicrophone.show();
    }

    closeAllMainPanel(){
        this.el.panelMessagesContainer.hide();
        this.el.panelDocumentPreview.removeClass('open');
        this.el.panelCamera.removeClass('open');
    }

    closeMenuAttach(e){
        
        document.removeEventListener('click', this.closeMenuAttach);
        this.el.menuAttach.removeClass('open');

    }

    closeAllLeftPanel(){

        this.el.panelEditProfile.hide();
        this.el.panelAddContact.hide();

    }
  
}