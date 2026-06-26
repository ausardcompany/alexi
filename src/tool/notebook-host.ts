import { Notebook, HostError } from "@/kilocode/notebook/service";
import { Path, type Result } from "@/kilocode/notebook/protocol";
import { NonNegativeInt } from "@opencode-ai/core/schema";
import * as Tool from "@/tool/tool";
import { Effect, Schema } from "effect";

// Define notebook host implementation here, similar to upstream
