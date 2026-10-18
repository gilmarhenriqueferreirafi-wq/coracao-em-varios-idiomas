import turtle


PHRASES = [
    "Eu te amo",
    "I love you",
    "Te quiero",
    "Je t'aime",
    "Ti amo",
    "Ich liebe dich",
    "Te iubesc",
    "Я тебя люблю",
    "愛してる",
    "사랑해",
    "我爱你",
    "Σ' αγαπώ",
    "Seni seviyorum",
    "أحبك",
]


def posicoes_do_coracao():
    """Cria linhas de texto com o contorno visual de um coração."""
    linhas = [
        (-175, [-180, -95, 95, 180]),
        (-130, [-260, -175, -90, 90, 175, 260]),
        (-85,  [-300, -215, -130, -45, 40, 125, 210, 295]),
        (-40,  [-300, -215, -130, -45, 40, 125, 210, 295]),
        (5,    [-300, -215, -130, -45, 40, 125, 210, 295]),
        (50,   [-260, -175, -90, 90, 175, 260]),
        (95,   [-220, -135, -50, 35, 120, 205]),
        (140,  [-170, -85, 0, 85, 170]),
        (185,  [-85, 0, 85]),
        (230,  [0]),
    ]
    return [(x, -y) for y, xs in linhas for x in xs]


def desenhar_coracao(tamanho: int = 9, passo: int = 75) -> None:
    """Desenha um coração vermelho feito de frases em vários idiomas."""
    tela = turtle.Screen()
    tela.setup(width=900, height=700)
    tela.bgcolor("black")
    tela.title("Um coração em vários idiomas")
    tela.tracer(1)

    caneta = turtle.Turtle()
    caneta.penup()
    caneta.color("#ff3158")
    caneta.hideturtle()
    caneta.speed(0)

    indice = 0
    for x, y in posicoes_do_coracao():
        frase = PHRASES[indice % len(PHRASES)]
        caneta.goto(x, y)
        caneta.write(frase, align="center", font=("Arial", tamanho, "bold"))
        indice += 1

    tela.mainloop()

