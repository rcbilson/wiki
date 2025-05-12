# wiki

Richard's simple wiki browser

## What is it?

I started keeping a personal wiki using [vimwiki](https://vimwiki.github.io/). This is convenient
because I usually want to edit notes on a computer, and I usually want to use Vim in particular to
do that. However, I also want to be able to view and change my notes on my phone sometimes. This
happens rarely enough that I don't want to use some other way of taking notes that's easier to
synchronize across devices. There is at least one person in the world who uses
[nextcloud](https://vkc.sh/vimwiki-101/) for this but I don't use or have much use for nextcloud and
it's pretty heavyweight for what's really a pretty simple use case.

Therefore: "wiki". There is a server component that serves up markdown files as created by vimwiki,
and a frontend component that fetches those markdown files and allows them to be viewed as HTML and
edited as text. Editing text on a phone sucks of course but as mentioned this is a rare case for me
so I can live with a bare-bones UX.

Note that the system as written assumes you have vimwiki configured to write markdown files with the
extension `.md`. This is not the default configuration. Because in this configuration vimwiki is
writing files with the extension `.md` but the internal wikilinks do not have an extension, the
server assumes it will get a URL with no `.md` and it looks up the corresponding file with the `.md`
extension.

## Building and running

`make docker` will build a container. I use a docker-compose fragment something
like this to run it:

```
  wiki:
    image: rcbilson/wiki:latest
    pull_policy: never
    ports:
      - 80:80
    volumes:
      - /path/to/vimwiki:/app/data
    restart: unless-stopped
```

## What's under the hood

The frontend is Vite + TypeScript + React. The backend is Go. The backend was hand-written; the
frontend was almost entirely written by GitHub Copilot.
