# Azure Artifact Signing (Windows)

Use this after **identity validation** shows **Completed** in the Azure portal.

## 1. Azure portal (one-time)

1. **KrakenCerts** → **Certificate profiles** → **Create**
2. Type: **Public Trust** → **Code Signing**
3. Name: e.g. `KrakenInterview-CodeSign`
4. **Verified CN and O**: pick your **Completed** identity (e.g. Roman Osipyan)
5. **Create**

6. **Access control (IAM)** on the account (or profile): assign yourself
   **Artifact Signing Certificate Profile Signer**

7. Note your **region endpoint** (must match where the account was created):

   | Region        | Endpoint                              |
   |---------------|---------------------------------------|
   | West Europe   | `https://weu.codesigning.azure.net`   |
   | North Europe  | `https://neu.codesigning.azure.net`   |
   | East US       | `https://eus.codesigning.azure.net`   |

   Full list: [Microsoft docs](https://learn.microsoft.com/en-us/azure/artifact-signing/how-to-signing-integrations#create-a-json-file)

## 2. Local machine (one-time)

```powershell
winget install -e --id Microsoft.Azure.ArtifactSigningClientTools
az login
```

Install **Windows SDK** SignTool **10.0.2261.755+** (Visual Studio Installer → Windows SDK).

Copy the example metadata file and edit it:

```powershell
copy scripts\azure-signing-metadata.example.json azure-signing-metadata.json
```

Add to root `.env` (gitignored):

```env
AZURE_ARTIFACT_SIGNING_METADATA=C:\path\to\azure-signing-metadata.json
```

Optional if dlib is not auto-detected:

```env
AZURE_ARTIFACT_SIGNING_DLIB=C:\Program Files\Microsoft Azure Artifact Signing Client Tools\x64\Azure.CodeSigning.Dlib.dll
```

## 3. Sign a release build

```powershell
npm run dist
```

Signing runs after the app is built and icons are patched (`scripts/pack.mjs` → `scripts/sign-windows.mjs`).

**Before signing:** run `az login` in the same terminal (uses Azure CLI credentials).

## 4. Verify

```powershell
Get-AuthenticodeSignature .\electron-dist\KrakenInterview.exe
```

Properties → **Digital Signatures** should show your validated legal name.

## Troubleshooting

| Error | Fix |
|-------|-----|
| 403 / SignerSign failed | Wrong **Endpoint** in metadata vs account region |
| Credential error | `az login` |
| dlib not found | Set `AZURE_ARTIFACT_SIGNING_DLIB` or reinstall client tools |
| Skipping sign | Set `AZURE_ARTIFACT_SIGNING_METADATA` or `WIN_CSC_LINK` (.pfx) |

Legacy **.pfx** signing still works via `WIN_CSC_LINK` + `WIN_CSC_KEY_PASSWORD` if set; Azure metadata takes precedence when both are set.
