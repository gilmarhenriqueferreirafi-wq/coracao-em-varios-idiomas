# Coração em vários idiomas

Site estático para GitHub Pages. O coração pode ser personalizado diretamente pela URL.

## Criar um link

Use o gerador:

```text
https://seu-usuario.github.io/seu-repositorio/gerar.html
```

Ele permite escolher nome, cor, fundo, tamanho da fonte, animação e mensagem.

## Opções da URL

| Opção | Valores | Exemplo |
| --- | --- | --- |
| `nome` | texto | `Emanuela` |
| `cor` | `rosa`, `vermelho`, `roxo`, `azul`, `verde`, `dourado` | `rosa` |
| `fundo` | `preto`, `rosa`, `roxo`, `azul` | `preto` |
| `fonte` | `pequena`, `media`, `grande` | `media` |
| `animacao` | `sim` ou `nao` | `sim` |
| `mensagem` | texto opcional | `Uma mensagem especial` |

Exemplo completo:

```text
https://seu-usuario.github.io/seu-repositorio/?nome=Emanuela&cor=rosa&fundo=preto&fonte=media&animacao=sim&mensagem=Uma%20mensagem%20especial
```

Sem o parâmetro `nome`, o site mostra uma página 404 estilizada. A mesma tela pode ser usada pelo arquivo `404.html` do GitHub Pages.

