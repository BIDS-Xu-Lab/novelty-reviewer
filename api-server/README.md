# API Server

LibreTranslate is used for the translation service. You can find more details about this service in the [LibreTranslate repository](https://github.com/LibreTranslate/LibreTranslate). It can be installed using the following command:

```bash
pip install libretranslate
```

Then we can run the translation server. For example, we use the following command to start the LibreTranslate service:

```bash
libretranslate --load-only en,zh
```