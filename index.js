const { Client, Collection } = require('discord.js')
require('dotenv').config()

const prefix = process.env.PREFIX

class infiClient extends Client 
{
    constructor()
    {
        super("client")
      this.commands = new Collection()
      
      const fs = require('fs')

      const folder = fs.readdirSync('./commands')

      for (const c of folder)
      {
          const f = fs.readdirSync(`./commands/${c}/`).filter(file => file.endsWith("js"));
          
          for (const cf of f)
          {
              const command = require(`./commands/${c}/${cf}`)
              this.commands.set(command.name, command);
          }
      }

      this.once('ready', () => 
      {
          console.log(`Ready at ${this.user.username}`)
      })

      this.once("message", m => 
      {
          if(!m.content.startsWith(prefix)) return;

          const args = m.content.slice(prefix.length).trim().split(/ +/)
          const cmd = args.shift().toLocaleLowerCase()
          const message = m

          const command = this.commands.get(cmd) 
          || this.commands.find(co => co.aliases && co.aliases.includes(cmd))

          if(!command) return;

          try
          {
              command.run(message, args, this)
          } catch (error)
          {
              console.log(error)
          }
      })
    }
}

 const infi = new infiClient()

 infi.login(process.env.TOKEN)