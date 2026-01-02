import { PointOfInterest } from '../types';

export const POINTS_OF_INTEREST_DATA: PointOfInterest[] = [
    {
        id: '1',
        title: 'Extintor',
        recommendations: [
            { id: '1.1', text: 'Desobstruir os extintores, bem como orientar os funcionários para não repetirem esta irregularidade. Os locais destinados aos extintores devem ser assinalados por uma seta larga, vermelha, com bordas amarelas, deverá ser pintada de vermelho uma larga área do piso embaixo do extintor, a qual não poderá ser obstruída por forma nenhuma. Essa área deverá ser no mínimo de 1m², os equipamentos não deverão ter sua parte superior a mais de 1,60m acima do piso, ou poderão ser instalados em suportes adequados no piso.' },
            { id: '1.2', text: 'Recarregar os extintores de incêndio e manter testes hidrostáticos dos cilindros em dia.' },
            { id: '1.3', text: 'Aumentar a quantidade de extintores de combate a incêndio, mantendo assim uma unidade a cada 250m² da área construída. Quando o imóvel tiver menos de 250m², deverá existir no mínimo 02 unidades extintoras no local, caso tenha mais de um pavimento ou mezanino, deverá haver 02 unidades por pavimento / mezanino.' }
        ]
    },
    {
        id: '2',
        title: 'Hidrante',
        recommendations: [
            { id: '2.1', text: 'Desobstruir os hidrantes, bem como orientando os funcionários para não repetirem esta irregularidade. Os locais destinados aos extintores devem ser assinalados por uma seta larga, vermelha, com bordas amarelas, deverá ser pintada de vermelho uma larga área do piso embaixo do extintor, a qual não poderá ser obstruída por forma nenhuma. Essa área deverá ser no mínimo de 1m², os equipamentos não deverão ter sua parte superior a mais de 1,60m acima do piso, ou poderão ser instalados em suportes adequados no piso.' },
            { id: '2.2', text: 'Manter caixas dos hidrantes completas com acessórios (mangueiras, chaves de engates, bicos de jatos sólidos ou regulável).' },
            { id: '2.3', text: 'Realizar testes hidrostáticos nas mangueiras dos hidrantes.' },
            { id: '2.4', text: 'Realizar manutenções nas caixas de acessórios dos hidrantes, de modo que fiquem em perfeitas condições de uso.' },
            { id: '2.5', text: 'Manter as mangueiras dos hidrantes desamarradas dos fitilhos e/ou similares, para que em caso emergencial, seja desenrolada rapidamente.' },
            { id: '2.6', text: 'Instalar rede de hidrantes, quando for loja reserva mínima de 60 m³ / Quando for Centro de Distribuição, reserva mínima de 120 m 3 .' }
        ]
    },
    {
        id: '3',
        title: 'Bomba de incêndio',
        recommendations: [
            { id: '3.1', text: 'Implantar cronograma formal de testes de acionamento da bomba de incêndio, periodicamente, através de um documento formalizado / checklist.' },
            { id: '3.2', text: 'Sugerimos isolar a bomba de incêndio, colocando-a em um compartimento fechado com paredes em alvenaria ou placas de gesso Drywall (do tipo rosa), e acesso dotado de porta corta-fogo.' },
            { id: '3.3', text: 'Manter o registro citado, na posição aberta e protegido contra fechamento, através de corrente e cadeado.' },
            { id: '3.4', text: 'Revisar o manômetro, bem como a rede dos hidrantes, verificando a deficiência citada, de modo que a rede fique totalmente pressurizada e adequada ao uso.' }
        ]
    },
    {
        id: '4',
        title: 'Alarmes de incêndio',
        recommendations: [
            { id: '4.1', text: 'Revisar a central de alarmes de incêndio, de modo que fique em perfeitas condições de funcionamento.' },
            { id: '4.2', text: 'Instalar alarme de incêndio com botoeiras manuais junto aos hidrantes, devidamente sinalizadas e com painel sinóptico instalado, onde haja pessoas 24hs (frontal a loja ou sala de monitoramento CFTV).' },
            { id: '4.3', text: 'Apresentar à seguradora laudo de revisão e funcionamento dos sistemas de alarmes contra incêndio instalados no risco.' }
        ]
    },
    {
        id: '5',
        title: 'Detectores de fumaça',
        recommendations: [
            { id: '5.1', text: 'Instalar sistema de detecção de fumaça no local, com alarme sonoro automático, com quadro sinóptico instalado em local estratégico, onde haja funcionários diariamente ou 24hs (frontal a loja ou sala de monitoramento).' },
            { id: '5.2', text: 'Em prédios com pé direito entre 03 e 06 metros, deverão ser instalados detectores dos tipos termovelocimétricos (lojas, setores de preparos de alimentos, câmaras frias, entre outros), prédios com alturas acima de 10mts, deverá possuir detectores dos tipos lineares (infravermelhos).' }
        ]
    },
    {
        id: '6',
        title: 'AVCB',
        recommendations: [
            { id: '6.1', text: 'Apresentar à seguradora o documento de AVCB (Auto de Vistoria do Corpo de Bombeiros), dentro do prazo de validade.' }
        ]
    },
    {
        id: '7',
        title: 'Treinamento de Brigada de Combate a Incêndio',
        recommendations: [
            { id: '7.1', text: 'Deverá ser formado um grupo de pessoas (mínimo de 15% dos colaboradores) devidamente treinadas e habilitadas, que comporão a brigada própria de incêndio da empresa, suficiente para manejar, em qualquer momento, o aparelhamento de proteção existente.' }
        ]
    },
    {
        id: '8',
        title: 'Instalações elétricas',
        recommendations: [
            { id: '8.1', text: 'Proteger as fiações elétricas aparentes em conduítes metálicos, ou em PVC rígidos ou flexíveis, bem como adotar para as emendas conectores apropriados.' },
            { id: '8.2', text: 'Eliminar as extensões improvisadas, instalando tomadas fixas.' },
            { id: '8.3', text: 'Evaporadores de ar, instalados no interior das câmaras frias, deverão possuir tampas de proteção metálicas nas laterais.' },
            { id: '8.4', text: 'As eletrocalhas e caixas de junção das fiações elétricas deverão possuir tampas de proteção.' },
            { id: '8.5', text: 'As chaves disjuntores deverão possuir proteção através de tampas metálicas.' },
            { id: '8.6', text: 'Manter organizados fios de redes ou CFTV, através de aspirais ou enforca gatos.' },
            { id: '8.7', text: 'Instalar em canaletas metálicas, todas as fiações trifásicas existentes no risco.' }
        ]
    },
    {
        id: '9',
        title: 'Luminárias',
        recommendations: [
            { id: '9.1', text: 'As luminárias deverão ter globo de proteção e a sua disposição deverá ser tal que elas fiquem nos corredores e nunca acima das mercadorias. Poderão ser substituídas por lâmpadas dos tipos Leds.' },
            { id: '9.2', text: 'Devido a umidade, nos interiores das câmaras frias, mesmo que as lâmpadas sejam tipo leds, deveram ser protegidas com globo de proteção.' },
            { id: '9.3', text: 'Substituir toda a rede elétrica do depósito e instalar refletores nas extremidades dos armazéns, evitando assim que as luminárias fiquem próximas das mercadorias.' },
            { id: '9.4', text: 'Instalar luminárias e tomadas blindadas nos locais com utilização/armazenamento de inflamáveis.' }
        ]
    },
    {
        id: '10',
        title: 'Coifas e Exaustores',
        recommendations: [
            { id: '10.1', text: 'Efetuar a correta limpeza do exaustor/coifa, bem como elaborar e apresentar a esta seguradora um cronograma com periodicidade de trabalhos de limpeza do equipamento.' },
            { id: '10.2', text: 'Instalar sobre a fritadeira e fogão, sistema de exaustão, minimizando assim, quantidade de gordura no setor, e que venha atingir os forros, bem como, instalações elétricas.' }
        ]
    },
    {
        id: '11',
        title: 'Óleo diesel',
        recommendations: [
            { id: '11.1', text: 'Construir dique de contenção com capacidade mínima de 110 % do volume total do tanque. Também deverá ser fixada na parte externa, uma placa do tipo “NÃO FUME – INFLAMÁVEIS”.' },
            { id: '11.2', text: 'Sugerimos instalar sob o gerador de energia citado, uma bacia de contenção, minimizando assim, vazamento do produto (óleo diesel).' },
            { id: '11.3', text: 'Transferir bombonas reservas de óleo diesel, para o lado externo do prédio, em abrigo adequado e com sistema de contenção (dique). Deverá contar ainda, com placa de alerta “NÃO FUME – INFLAMÁVEIS”.' }
        ]
    },
    {
        id: '12',
        title: 'Gás GLP/Cilindros',
        recommendations: [
            { id: '12.1', text: 'Transferir os botijões de gás GLP para local (externo) isolado e arejado, e devidamente sinalizado, com placa de alerta “NÃO FUME - INFLAMÁVEIS”.' },
            { id: '12.2', text: 'Transferir o cilindro de gás GLP reserva da empilhadeira, para local (externo) isolado e arejado, protegido contra quedas através correntes ou em abrigo fechado e, devidamente sinalizado, com placa de alerta “NÃO FUME - INFLAMÁVEIS”.' }
        ]
    },
    {
        id: '13',
        title: 'Quadros de energia',
        recommendations: [
            { id: '13.1', text: 'Pintar abaixo dos quadros de energias, um largo quadrado (1m²) nas cores azul ou branca, para que eles permaneçam desobstruídos e não possuam materiais combustíveis próximos.' },
            { id: '13.2', text: 'Manter portão de acesso aos painéis de energias gerais, sempre distribuídos, com acesso livre.' }
        ]
    },
    {
        id: '14',
        title: 'Câmaras frias',
        recommendations: [
            { id: '14.1', text: 'Manter as mercadorias estocadas no interior das câmaras frias, distantes dos forros, das lâmpadas e dos evaporadores de ar, entre 40cm a 60cm.' },
            { id: '14.2', text: 'Não estocar mercadorias e materiais próximas das câmaras frias (lado externo), mantendo no mínimo 1m de distância, bem como sobre elas.' },
            { id: '14.3', text: 'Realizar revisão nas câmaras frias de produtos congelados, minimizando acúmulo de gelo internamente / condensação.' },
            { id: '14.4', text: 'Realizar manutenção na câmara fria citada, substituindo os painéis em isopainéis danificados, por painéis em bom estado, de modo que o produto isolante interno (combustível), não fique exposto.' }
        ]
    },
    {
        id: '15',
        title: 'Depósitos',
        recommendations: [
            { id: '15.1', text: 'Nas áreas de depósitos, sinalizar os corredores centrais e laterais de circulação de pessoas e empilhadeiras, mediante a pintura de faixas no piso. Estas faixas de sinalização deverão ser pintadas nas cores AMARELA OU BRANCA.' },
            { id: '15.2', text: 'Os empilhamentos devem ter pelo menos 1m de distância dos forros, das lâmpadas e das tubulações de incêndio, e não ficarem abaixo dos travejamentos e da cobertura em pelo menos 1m de distância, bem como não ficarem abaixo de luminárias e/ou instalações elétricas (eletrocalhas ou tubulações).' },
            { id: '15.3', text: 'Sugerimos instalar base de proteção de coluna nas portas pallets instaladas no interior do depósito de mercadorias, protegendo contra impacto de empilhadeiras.' },
            { id: '15.4', text: 'Instalar nas bases das prateleiras, sistemas de proteções, dos tipos cantoneiras ou barras metálicas, evitando assim colisões ou impactos das empilhadeiras, e possíveis danos ou quedas, efeito dominó/cascata.' }
        ]
    },
    {
        id: '16',
        title: 'Materiais indevidos',
        recommendations: [
            { id: '16.1', text: 'Retirar os materiais diversos e em desusos armazenados nas áreas de motores de refrigeração, compartimento do gerador, bombas de incêndio, sala dos painéis de energias, salas do Nobreak, deixando os locais, exclusivamente para os fins a que se destinam, orientando os funcionários, a não repetirem estas irregularidades.' },
            { id: '16.2', text: 'Retirar os materiais diversos e em desusos armazenados próximos ao abrigo de gás deixando os locais, exclusivamente para os fins a que se destinam, orientando os funcionários, a não repetirem estas irregularidades.' },
            { id: '16.3', text: 'Descartar materiais fora de uso, existentes e estocados no local, mantendo somente materiais para uso e organizados.' },
            { id: '16.4', text: 'Retirar as mercadorias estocadas sobre as geladeiras instaladas na loja, e orientar os funcionários, a não repetirem estas irregularidades.' }
        ]
    },
    {
        id: '17',
        title: 'Aterramento (equipamentos com inflamáveis)',
        recommendations: [
            { id: '17.1', text: 'Instalar aterramento contra descargas elétricas ou eletrostáticas, para as estruturas metálicas do tanque de óleo diesel ou gerador de energia, instalados ao ar livre.' },
            { id: '17.2', text: 'Instalar aterramento para estrutura metálica do tanque de óleo diesel (externo), bem como, de cabo com aproximadamente 10m de comprimento, para aterramento do veículo em operação de descarga do produto e a instalação de placas indicando a existência de inflamável, com placas alusivas ao perigo e de proibições de emprego de aparelhos que produzam faíscas e/ou chamas abertas.' }
        ]
    },
    {
        id: '18',
        title: 'Resíduos recicláveis',
        recommendations: [
            { id: '18.1', text: 'Sugerimos manter os fardos de resíduos dos papelões, isolados ao lado externo do prédio, ou aumentar a retirada deles, de modo que seja diariamente.' }
        ]
    },
    {
        id: '19',
        title: 'Prensa de papelão',
        recommendations: [
            { id: '19.1', text: 'Prensa dos resíduos de papelão e plásticos, deverá ser remanejada para o lado externo do prédio, em abrigo isolado, com instalação elétrica protegida / blindada ou sem iluminação, e com proteção através de extintores. Caso não seja viável o remanejamento para o lado externo, por falta de espaço físico, deverá ser construída uma sala com paredes em alvenaria, instalação elétrica protegida e isolamento do acesso através de porta corta fogo.' }
        ]
    },
    {
        id: '20',
        title: 'Estrutura em madeira',
        recommendations: [
            { id: '20.1', text: 'Sugerimos substituir prateleiras em madeira, por outro de material incombustível (metálicas ou similares), ou realizar pinturas com tintas especiais, de proteção contra chamas de fogo.' },
            { id: '20.2', text: 'Substituir os mezaninos em madeira, por outro de material incombustível (metálicas ou similares), ou realizar pinturas com tintas especiais, de proteção contra chamas de fogo.' },
            { id: '20.3', text: 'Substituir o forro combustível, travejamentos em madeira, por outro de material incombustível (metálico ou concreto), ou realizar pinturas com tintas especais, retardante contra chamas de fogo.' },
            { id: '20.4', text: 'Retirar os pallets em madeira citados, do interior do prédio, os quais deverão ficar ao lado externo e afastados no mínimo 5,0m. Manter internamente somente os pallets vazios de uso diário. Vale ressaltar a construção de abrigo específico para os pallets externos.' },
            { id: '20.5', text: 'Retirar os pallets em madeira encostados nas paredes externas do prédio, os quais deverão ficar afastados da edificação no mínimo 5,0m. Vale ressaltar a construção de abrigo específico para os pallets externos.' }
        ]
    },
    {
        id: '21',
        title: 'Carregador de bateria',
        recommendations: [
            { id: '21.1', text: 'Substituir caixa de apoio combustível, sob carregador de baterias, por um apoio de material incombustível (metal ou concreto).' },
            { id: '21.2', text: 'Manter os carregadores de baterias isolados das mercadorias, no mínimo 1,0m. Criar barreiras entre os equipamentos, evitando estocagens de materiais ou mercadorias próximos deles.' }
        ]
    },
    {
        id: '22',
        title: 'Sistema de Para Raios',
        recommendations: [
            { id: '22.1', text: 'Recomendamos realizar revisão no sistema de para raios (SPDA) existente, e instalar o referido sistema nos edifícios que não possuem. O sistema deverá ser revisado anualmente, com medições das resistências ôhmicas, através de uma empresa especializada, com emissão de laudos técnicos.' },
            { id: '22.2', text: 'Recomendamos instalar sistema de para-raios dos tipos Gaiola de Faraday ou Franklin, e realizar revisão do respectivo sistema anualmente, com medições das resistências ôhmicas, através de uma empresa especializada, com emissão de laudos técnicos.' },
            { id: '22.3', text: 'Sobre para-raios do tipo radioativo, sugerimos sua retirada, tendo em vista, que em testes realizados por órgãos competentes, foi declarado que o equipamento não é eficiente. Existem relatos ainda, que por possuir material altamente radioativo, oferece grande risco de radiação, principalmente em atividades realizadas em manutenções de telhados.' }
        ]
    },
    {
        id: '23',
        title: 'Transformador de Energia',
        recommendations: [
            { id: '23.1', text: 'Recomendamos realizar manutenções ou revisões dos transformadores existentes (óleo), através de uma empresa especializada, com emissão de laudo técnico específico, anualmente.' },
            { id: '23.2', text: 'Recomendamos realizar revisões periódicas das instalações elétricas dos transformadores, dos tipos a seco.' }
        ]
    },
    {
        id: '24',
        title: 'Manutenção Predial',
        recommendations: [
            { id: '24.1', text: 'Realizar manutenções dos forros, instalando as placas de proteção.' },
            { id: '24.2', text: 'Eliminar pontos de infiltração de água, existentes no interior do Risco.' }
        ]
    },
    {
        id: '25',
        title: 'Placas de alerta',
        recommendations: [
            { id: '25.1', text: 'Instalar junto ao gerador de energia ou fixada na porta de acesso, placa de alerta do tipo “NÃO FUME – INFLAMÁVEIS”.' },
            { id: '25.2', text: 'Instalar junto ao compartimento de gás GLP ou fixada na porta de acesso, placa de alerta do tipo “NÃO FUME – INFLAMÁVEIS”.' },
            { id: '25.3', text: 'Instalar junto na porta de acesso a bomba de incêndio ou próxima dela, placa de alerta do tipo “BOMBA DE INCÊNDIO”.' }
        ]
    },
    {
        id: '26',
        title: 'Vegetação alta',
        recommendations: [
            { id: '26.1', text: 'Manter as vegetações próximas da bomba de incêndio sempre cortadas/podadas.' },
            { id: '26.2', text: 'Manter as vegetações próximas do compartimento de cilindros de gás GLP sempre cortadas/podadas.' },
            { id: '26.3', text: 'Manter as vegetações próximas dos prédios sempre cortadas/podadas.' }
        ]
    },
    {
        id: '27',
        title: 'Banco 24h',
        recommendations: [
            { id: '27.1', text: 'Sugerimos remover os caixas eletrônicos de banco das dependências do segurado de forma a evitar danos causados por atos de vandalismo, que visem os caixas e seu conteúdo.' },
            { id: '27.2', text: 'Sugerimos a remoção do caixa eletrônico, por sua vez instalado internamente na loja, para o lado externo do prédio, evitando danos causados por atos de vandalismo, que visem os caixas e seu conteúdo (valores em dinheiro), bem como explosão do caixa.' }
        ]
    },
    {
        id: '28',
        title: 'Inflamáveis',
        recommendations: [
            { id: '28.1', text: 'Isolar todos os inflamáveis em abrigo externo distante cerca de 10,0m de qualquer prédio existente no local, e nesse abrigo não deverá ser instalado qualquer tipo de energia/iluminação artificial.' },
            { id: '28.2', text: 'Dentro do risco será permitida somente a quantidade diária de consumo de produtos inflamáveis.' },
            { id: '28.3', text: 'Caso os inflamáveis, fiquem no interior do prédio, deverão ser estocadas em armário específico metálicos, a prova de fogo.' }
        ]
    },
    {
        id: '29',
        title: 'Roubo de bens',
        recommendations: [
            { id: '29.1', text: 'Instalar alarme monitorado em central de segurança via internet, com monitoramento através de câmeras instaladas no local segurado, durante as 24 horas do dia. No local deverão existir botões de pânico devidamente instalados em áreas administrativas, loja e depósito, para que possam ser acionados por pessoas devidamente confiáveis para tal.' },
            { id: '29.2', text: 'Sugerimos a instalação de sistema de alarmes contra roubo do tipo sensores infravermelhos, sensores de aberturas (portas e janelas) e botões de pânico, que deverão ser instalados em pontos estratégicos. Todos deverão contar com monitoramento em empresa de segurança especializada via rádio, internet ou celular.' },
            { id: '29.3', text: 'Sugerimos a instalação de sistema de CFTV com câmeras instaladas em pontos estratégicos, com monitoramento e gravação das imagens no local, e por empresa especializada em segurança, bem como acesso das imagens via celular.' }
        ]
    },
    {
        id: '30',
        title: 'Estacionamento',
        recommendations: [
            { id: '30.1', text: 'Instalar os equipamentos de controle dos acessos de autos, com câmeras de monitoramento instaladas em pontos estratégicos, visualizando especificamente as placas dos veículos, tanto na entrada, quanto na saída, e mantê-las sempre calibradas de modo que as imagens fiquem nítidas.' },
            { id: '30.2', text: 'Sugerimos calibrar as câmeras e monitores do sistema de CFTV, principalmente as câmeras que ficam instaladas nos acessos dos estacionamentos, de modo que as imagens fiquem em perfeitas condições de visualização.' }
        ]
    },
    {
        id: '31',
        title: 'Proteção de equipamentos (contra roubos)',
        recommendations: [
            { id: '31.1', text: 'Proteger os equipamentos citados, através de gradil, evitando assim possíveis impactos de veículos, estocagens de materiais próximos dos equipamentos e acesso fácil por pessoas.' },
            { id: '31.2', text: 'Proteger o equipamento citado, através de gradil, evitando assim possível impacto de veículos, estocagens de materiais próximos do equipamento e acesso fácil por pessoas.' }
        ]
    },
    {
        id: '32',
        title: 'Proteção de escadas',
        recommendations: [
            { id: '32.1', text: 'Instalar nas escadas internas, proteção contra quedas de pessoas, como pisos antiderrapantes proteção e grades guarda-corpos.' }
        ]
    },
    {
        id: '33',
        title: 'Áreas em obras',
        recommendations: [
            { id: '33.1', text: 'Após as conclusões das obras, deverão dar ciência à corretora, para que possamos adequar a apólice, bem como valores de seguro patrimonial.' },
            { id: '33.2', text: 'Nesta nova ampliação (após conclusão) deverá haver protecionais contra incêndio instalados, no mínimo 02 unidades, dos tipos água (10L) e pó-químico (4kg).' }
        ]
    },
    {
        id: '34',
        title: 'Análise Termográfica',
        recommendations: [
            { id: '34.1', text: 'Realizar análises termográficas, nos principais quadros de distribuições de energias (entradas, subestações, casa de máquinas, gerador de energia, entre outros), com emissão de laudo técnico específico, através de uma empresa terceirizada.' }
        ]
    }
];
