const { Router } = require("express");

module.exports.Router = class Routes extends (
  Router
) {
  constructor() {
    super();

    this.get("/:id?", async function (req, res) {
      if (!req.user) return res.redirect("/login");
      function getguild(guilds, id) {
        var g = null;
        for (var i = 0; i < guilds.length; i++) {
          if (guilds[i].id == id && (guilds[i].permissions & 0x8) == 0x8) {
            guilds[i].botin = check(guilds[i].id);
            if (guilds[i].botin) {
              const server = req.client.guilds.cache.get(guilds[i].id);
              guilds[i].channels = server.channels.cache;
              g = guilds[i];
              break;
            }
          }
        }
        return g;
      }
      function check(id) {
        const server = req.client.guilds.cache.get(id);
        if (server) return true;
        return false;
      }
      function getguilds(guilds) {
        var g = [];
        for (var i = 0; i < guilds.length; i++) {
          if (guilds[i].permissions & 0x8) {
            guilds[i].botin = check(guilds[i].id);

            g.push(guilds[i]);
          }
        }
        return g;
      }

      var guilds = getguilds(req.user.guilds).sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      var theguild = req.params.id
        ? getguild(req.user.guilds, req.params.id)
        : null;
      if (!theguild) {
        for (var i = 0; i < guilds.length; i++) {
          if (guilds[i].botin) {
            theguild = guilds[i]
            break;
          }
        }
      }
      return res.render("dashboard.ejs", {
        user: req.user.me,
        guilds: guilds,
        guild: theguild,
        currentid: theguild.id || "",
      });
    });
  }
};

module.exports.page = "/dashboard";
