"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodValidationPipe = void 0;
const common_1 = require("@nestjs/common");
class ZodValidationPipe {
    constructor(schema) {
        this.schema = schema;
    }
    transform(value) {
        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        }
        catch (error) {
            const errorMessage = error.errors
                .map((err) => `${err.path.join('.')}: ${err.message}`)
                .join(', ');
            throw new common_1.BadRequestException(`Falha na validação: ${errorMessage}`);
        }
    }
}
exports.ZodValidationPipe = ZodValidationPipe;
//# sourceMappingURL=zod-validation.pipe.js.map