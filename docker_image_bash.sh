docker build . --file Dockerfile --tag ${REGISTRY_HOST}/${REGISTRY_SPACE}/${REPO_NAME}-${BRANCH_NAME}:${IMAGE_VERSION} --tag ${REGISTRY_HOST}/${REGISTRY_SPACE}/${REPO_NAME}-${BRANCH_NAME}:latest
docker build ./consumer --file ./consumer/Dockerfile --tag ${REGISTRY_HOST}/${REGISTRY_SPACE}/consumer-${REPO_NAME}-${BRANCH_NAME}:${IMAGE_VERSION} --tag ${REGISTRY_HOST}/${REGISTRY_SPACE}/consumer-${REPO_NAME}-${BRANCH_NAME}:latest
docker push ${REGISTRY_HOST}/${REGISTRY_SPACE}/${REPO_NAME}-${BRANCH_NAME}:${IMAGE_VERSION}
docker push ${REGISTRY_HOST}/${REGISTRY_SPACE}/${REPO_NAME}-${BRANCH_NAME}:latest
docker push ${REGISTRY_HOST}/${REGISTRY_SPACE}/consumer-${REPO_NAME}-${BRANCH_NAME}:${IMAGE_VERSION}
docker push ${REGISTRY_HOST}/${REGISTRY_SPACE}/consumer-${REPO_NAME}-${BRANCH_NAME}:latest