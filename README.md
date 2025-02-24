<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/supaglue-labs/supaglue/main/docs/static/img/logo-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/supaglue-labs/supaglue/main/docs/static/img/logo-light.png">
  <img alt="Supaglue" src="https://raw.githubusercontent.com/supaglue-labs/supaglue/main/docs/static/img/logo-light.png">
</picture>
</p>

<p align="center">
  <a href="https://hub.docker.com/r/supaglue/api" target="_blank"><img alt="Docker Image Version (latest semver)" src="https://img.shields.io/docker/v/supaglue/api"></a>
  <a href="https://github.com/supaglue-labs/supaglue/actions/workflows/ci.yml"><img title="CI Status" src="https://github.com/supaglue-labs/supaglue/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://github.com/supaglue-labs/supaglue/issues"><img title="github issues" src="https://img.shields.io/github/issues/supaglue-labs/supaglue"></a>
  <a href="https://github.com/supaglue-labs/supaglue"><img title="github activity" src="https://img.shields.io/github/commit-activity/w/supaglue-labs/supaglue"></a>
  <a href="https://github.com/supaglue-labs/supaglue"><img title="github stars" src="https://img.shields.io/github/stars/supaglue-labs/supaglue?style=social"></a>
</p>

<p align="center">
  <a href="https://supaglue.com?ref=github-readme" target="_blank">Website</a> • <a href="https://docs.supaglue.com/quickstart?ref=github-readme" target="_blank">Quickstart</a> • <a href="https://docs.supaglue.com?ref=github-readme" target="_blank">Docs</a> • <a href="https://join.slack.com/t/supagluecommunity/shared_invite/zt-1o2hiozzl-ZRQswNzlT5W4sXwrQnVlDg" target="_blank">Slack</a> • <a href="https://twitter.com/supaglue_labs" target="_blank">Twitter</a>
</p>

# Supaglue

Supaglue is an open source unified API for CRMs. It handles authentication, caches and normalizes data from multiple CRM platforms, and provides a single set of API endpoints for reading and writing to those CRMs. Developers at B2B companies can use Supaglue to streamline and scale the work of building customer-facing CRM integrations. Supaglue can be self-hosted and runs alongside your stack.

https://user-images.githubusercontent.com/1925713/223279162-c53ceb43-b51e-4d78-9f7b-d36ac141cecf.mp4

## Get Started

### Run Supaglue locally

```shell
git clone -b v0.7.9 https://github.com/supaglue-labs/supaglue.git && cd supaglue
./scripts/create_quickstart_env.sh
docker compose up
```

## Features

- **Unified API**: single developer interface to read from and write to multiple third-party providers.
- **Common model**: a common data model for CRMs that has been standardized across multiple third-party providers.
- **High performance**: query against synced data in your own cloud with no rate limits.
- **Open source**: self-host and run Supaglue for free.
- **Privacy-first**: prevent sensitive customer data from leaving your infrastructure.
- **BYO-connectors**: extend Supaglue with your own connectors.
- **Developer-centric**: self-host multiple instances for local, staging, and production environments.
- **Monitoring and logs**: monitor the status of syncs and stream logs to your cloud.

## Connectors

See the [list of connectors](https://docs.supaglue.com/connectors) we currently support.

Continue on to the docs to go through our [quickstart](https://docs.supaglue.com/quickstart?ref=github-readme).

## Status

We are currently in Public Alpha. Watch "releases" of this repo to be notified of significant updates (as minor semver releases).

## Roadmap

Check out our [roadmap](https://docs.supaglue.com/roadmap) to get informed on what we are currently working on, and what we have in mind for the next weeks, months, and quarters.

## Community

For general help using Supaglue, please refer to our [documentation](https://docs.supaglue.com). For additional help, you can use one of these channels to chat with us:

- [Slack](https://join.slack.com/t/supagluecommunity/shared_invite/zt-1o2hiozzl-ZRQswNzlT5W4sXwrQnVlDg) - Discuss Supaglue with the team and other developers
- [Github](https://github.com/supaglue-labs/supaglue) - File bug reports and make code contributions
- [Twitter](https://twitter.com/supaglue_labs) - Get the latest news and announcements

## Contributing

Learn about ways to [contribute to Supaglue](https://docs.supaglue.com/contributing).

## License

[MIT License](https://github.com/supaglue-labs/supaglue/blob/main/LICENSE).
