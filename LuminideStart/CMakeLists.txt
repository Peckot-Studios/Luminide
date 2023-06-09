cmake_minimum_required(VERSION 3.0)

project(LuminideStart)

if(WIN32)
    set(ICON_FILE "/icon.ico")
    set(EXECUTABLE_NAME "LuminideStart")

    configure_file("${ICON_FILE}" "${CMAKE_BINARY_DIR}/${EXECUTABLE_NAME}.ico" COPYONLY)

    if(MSVC)
        set_property(SOURCE windows.cpp APPEND PROPERTY OBJECT_DEPENDS "${CMAKE_BINARY_DIR}/${EXECUTABLE_NAME}.ico")
    else()
        set(CMAKE_RC_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}")
        add_executable(${EXECUTABLE_NAME} WIN32 windows.cpp)
        target_sources(${EXECUTABLE_NAME} PRIVATE "${CMAKE_BINARY_DIR}/${EXECUTABLE_NAME}.ico")
    endif()
else()
    add_executable(${EXECUTABLE_NAME} linux.cpp)
endif()
