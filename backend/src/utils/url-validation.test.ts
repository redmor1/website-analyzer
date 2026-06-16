import { describe, expect, it } from "vitest"

import { validateTargetUrl } from "./url-validation.js"

describe("URL Validation Security Tests", () => {
  it("accepts valid, public external URLs", async () => {
    // resolves.toBe ensures the function returns the input successfully
    await expect(validateTargetUrl("https://google.com")).resolves.toBe(
      "https://google.com",
    )
    await expect(validateTargetUrl("http://scanme.nmap.org")).resolves.toBe(
      "http://scanme.nmap.org",
    )
    await expect(validateTargetUrl("https://github.com:443")).resolves.toBe(
      "https://github.com:443",
    )
  })

  it("rejects command injection attempts", async () => {
    // rejects.toThrow ensures the function throws an error and stops execution
    await expect(validateTargetUrl("http://google.com;ls")).rejects.toThrow()
    await expect(
      validateTargetUrl("http://google.com|whoami"),
    ).rejects.toThrow()
    await expect(
      validateTargetUrl("http://google.com$(sleep 10)"),
    ).rejects.toThrow()
  })

  it("rejects direct private IP addresses", async () => {
    await expect(validateTargetUrl("http://127.0.0.1")).rejects.toThrow()
    await expect(validateTargetUrl("http://10.0.0.1")).rejects.toThrow()
    await expect(validateTargetUrl("http://192.168.1.100")).rejects.toThrow()
    await expect(validateTargetUrl("http://169.254.169.254")).rejects.toThrow()
  })

  it("rejects DNS-masked private IPs", async () => {
    await expect(validateTargetUrl("http://127.0.0.1.nip.io")).rejects.toThrow()
    await expect(validateTargetUrl("http://localtest.me")).rejects.toThrow()
  })
})
