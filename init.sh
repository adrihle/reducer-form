while true; do
    printf "Repository name: "
    read repository
    if [[ -z "$repository" ]]; then
        echo "Repository name cannot be empty."
    else
        break
    fi
done

while true; do
    printf "Package description: "
    read description
    break
done

echo "Updating project..."

find . -type f \( -name "*.json" -o -name "*.md" \) -exec sed -i '' "s/YOUR_REPOSITORY_NAME/$repository/g; s/YOUR_DESCRIPTION/$description/g" {} +

echo "Package project updated!"

echo "Initializing project..."

npm i

echo "Project initialized"
