{
  description = "Cosma — a document graph visualization tool";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f system nixpkgs.legacyPackages.${system});
    in
    {
      packages = forAllSystems (
        system: pkgs: {
          default = pkgs.buildNpmPackage {
            pname = "cosma";
            version = "2.6.1";
            src = ./.;
            nodejs = pkgs.nodejs_22;

            # Use package-lock.json instead of flake.lock for dependency locking.
            npmDeps = pkgs.importNpmLock { npmRoot = ./.; };
            npmConfigHook = pkgs.importNpmLock.npmConfigHook;

            # Skip install lifecycle scripts during `npm ci`.
            npmFlags = [ "--ignore-scripts" ];

            npmBuildScript = "prepare";

            meta = {
              description = "Document graph visualization tool";
              homepage = "https://cosma.arthurperret.fr/";
              license = with pkgs.lib.licenses; [
                gpl3Plus
                cecill21
              ];
              mainProgram = "cosma";
            };
          };
        }
      );
    };
}
