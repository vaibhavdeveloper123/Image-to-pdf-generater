 var Hummus = (function () {
    var _hummus = {};

    _hummus.createWriterToModify = function (buffer, options) {
        return new Promise(function (resolve, reject) {
            try {
                var Module = HummusWASM({
                    wasmBinary: options.wasmBinary
                });

                Module.onRuntimeInitialized = function () {
                    try {
                        var inputPtr = Module._malloc(buffer.byteLength);
                        Module.HEAPU8.set(new Uint8Array(buffer), inputPtr);

                        var outStream = new Module.PDFWStreamForBuffer();
                        var writer = new Module.PDFWriter();

                        var result = writer.modifyPDFUsingBuffer(inputPtr, buffer.byteLength, outStream);

                        if (result !== 0) {
                            reject("PDF modification failed");
                            return;
                        }

                        var output = outStream.toBuffer();
                        resolve(output);
                    } catch (err) {
                        reject(err);
                    }
                };
            } catch (e) {
                reject(e);
            }
        });
    };

    return _hummus;
})();