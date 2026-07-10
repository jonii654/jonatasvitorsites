## Objetivo
Trocar o domínio dentro de `public/sitemap.xml` para `https://jon2i.sites.com.br` e publicar o site.

## Alteração

**Arquivo:** `public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jon2i.sites.com.br/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

(Único `<loc>` do arquivo trocado do domínio antigo `jonatasvitorsites.lovable.app` para o novo `jon2i.sites.com.br`.)

## Depois
Rodar `preview_ui--publish` para o deploy ir ao ar.

## Observação
Isso só troca o sitemap. Para o domínio `jon2i.sites.com.br` funcionar de fato, ele precisa estar conectado em **Project Settings → Domains** com os registros DNS apontando para a Lovable — se ainda não estiver, me avisa que te guio no passo a passo.
