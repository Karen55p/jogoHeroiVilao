const { createApp } = Vue;

createApp({
    //define os dados do aplicativo
    data() {
        return {
            //controlar a vida dos personagens
            heroi: {vida: 100},
            vilao: {vida: 100},
            //booleano para controlar quando a última ação do herói foi ataque ou poção
            atk: false,
            poc: false,
            //variáveis que serão usadas para guardar a vida anterior dos personagens
            vidaH: 0,
            vidaV: 0,
            //usado para caso a fuga seja bem sucedida, seja possível finalizar o jogo
            fuga: false,
            //array para salvar o histórico de batalha
            mensagens: [],
            //booleano para mostrar o botão de reiniciar quando a batalha chegar no fim
            mostrarBotaoReiniciar: false
        }
    },
    methods: {
        //metódo para a função de ataque dos personagens
        atacar(isHeroi) {
            //guarda a vida anterior do vilão para caso ele se defenda do ataque
            this.vidaV = this.vilao.vida;
            if(isHeroi) {
                //passo ataque como true para caso o vilão se defenda
                this.atk = true;
                //diminui a vida do vilão em 20
                this.vilao.vida -= 20;
                //verifica se a vida do vilão zerou
                if (this.vilao.vida <= 0){
                    this.adicionarMensagem("Você venceu");
                    //chama o metódo do final da batalha
                    this.fim();
                } else {
                    this.adicionarMensagem("Você Atacou");
                    //chama a ação do vilão
                    this.acaoVilao();
                }
            } else {
                //vilão ataca o herói
                this.heroi.vida -= 20;
                this.adicionarMensagem("Vilão te atacou");
                this.fim();
            };
            this.poc = false;
        },
        //metódo que controla a função de defesa dos personagens
        defender(isHeroi) {
            if(isHeroi){
                //herói se defende da ação do vilão, que não age por conta da defesa
                this.adicionarMensagem("Você defendeu");
            } else {
                //estrutura de if else para controlar a defesa do vilão contra o ataque, a poção e a fuga
                if(this.atk === true){
                    this.adicionarMensagem("Vilão desviou do ataque");
                    this.vilao.vida = this.vidaV;
                    this.atk = false;
                }else if(this.poc === true){
                    this.adicionarMensagem("Você perdeu a poção");
                    this.heroi.vida = this.vidaH;
                    this.poc = false;
                }else{
                    this.adicionarMensagem("O vilão te impediu")
                    this.atk = false;
                    this.poc = false;
                }
            };
            this.fim();
        },
        //metódo para controlar a ação de usar poção dos personagens
        usarPocao(isHeroi) {
            this.vidaH = this.heroi.vida;
            if(isHeroi){
                this.poc = true;
                this.heroi.vida += 10;
                this.adicionarMensagem("Você usou a poção")
                //if para impedir que a vida ultrapasse 100 ao usar a poção
                if(this.heroi.vida >= 100){
                    this.heroi.vida = 100
                }
                this.acaoVilao();
            } else {
                this.vilao.vida += 10;
                this.adicionarMensagem("Vilão usou a poção")
                if(this.vilao.vida >= 100){
                    this.vilao.vida = 100
                }
            };
            this.atk = false;
        },
        //metódo para controlar a opção de correr dos personagens
        correr(isHeroi) {
            //variável para dar a chance 50% de fuga
            let fugir = Math.random();
            if(isHeroi && fugir <= 0.5){
                this.adicionarMensagem("Você Fugiu");
                this.fuga = true;
                this.fim();
            } else if(isHeroi) {
                this.adicionarMensagem("Você falhou em fugir");
                this.acaoVilao();
            } else if (fugir <= 0.5){
                this.adicionarMensagem("Vilão Fugiu");
                this.fuga = true;
                this.fim();
            } else {
                this.adicionarMensagem("Vilão Falhou em Fugir");
            };
            this.atk = false;
            this.poc = false;
        },
        //metódo para soltar aleatoriamente a ação do vilão
        acaoVilao() {
            const acoes = ['atacar', 'defender', 'usarPocao', 'correr'];
            const acaoAleatoria = acoes[Math.floor(Math.random() * acoes.length)];
            this[acaoAleatoria](false);
        },
        //metódo para jogar o fim da batalha seja ele por fuga, seja por morte
        fim(){
            if(this.heroi.vida <= 0 || this.vilao.vida <= 0){
                this.adicionarMensagem("A batalha acabou em morte");
                this.mostrarBotaoReiniciar = true; // Mostrar o botão reiniciar
            } else if (this.fuga === true) {
                this.adicionarMensagem("A batalha acabou por fuga covarde");
                this.mostrarBotaoReiniciar = true;
            };
        },
        //metódo para reiniciar o jogo
        reiniciar(){
            this.heroi.vida = 100;
            this.vilao.vida = 100;
            this.atk = false;
            this.poc = false;
            this.vidaH = 0;
            this.vidaV = 0;
            this.fuga = false;
            this.mensagens = [];
            this.mostrarBotaoReiniciar = false;
        },
        //metódo para exibir o histórico de batalha
        adicionarMensagem(mensagem) {
            this.mensagens.push({
                id: this.mensagens.length + 1,
                texto: mensagem
            });
            this.$nextTick(() => {
                // Rola automaticamente para a última mensagem adicionada
                const historia = document.querySelector('.historia');
                historia.scrollTop = historia.scrollHeight;
            });
        }
    }
}).mount("#app");