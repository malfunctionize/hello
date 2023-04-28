module.exports = {
  "run": [
    {
      "method": "llm",
      "params": {
        "path": "{{config.llama.path}}",
        "message": {
          "_": [
            "./main"
          ],
          "m": "{{config.llama.model}}",
          "p": "### Instruction\n\nI want you to take a photo of {{config.character}}. Simply write what {{config.character}} is doing and where he is, in detail.\n\n### Response"
        }
      },
      "returns": "description"
    },
    {
      "method": "fetch",
      "params": {
        "url": "{{config.automatic1111.url}}",
        "method": "post",
        "headers": { "content-type": "application/json" },
        "body": {
          "cfg_scale": "{{config.automatic1111.cfg_scale}}",
          "override_settings": {
            "sd_model_checkpoint": "{{random config.automatic1111.models}}"
          },
          "steps": "{{config.automatic1111.steps}}",
          "prompt": "a ((black and white)) photo of {{config.character}}. {{description}}"
        },
        "response": "json"
      },
      "returns": "automatic1111"
    },
    async (memory) => {
      memory.image = Buffer.from(memory.automatic1111.images[0], "base64")
    },
    {
      "method": "fetch",
      "params": {
        "url": "{{config.blog.url}}",
        "method": "post",
        "body": {
          "image": "{{image}}",
          "text": "{{description}}"
        }
      },
      "response": "json"
    },
    {
      "method": "sleep",
      "params": {
        "sec": 10
      }
    }
  ]
}
