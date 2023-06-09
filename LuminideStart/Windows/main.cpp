#include <iostream>
#include <string>
#include <windows.h>

using namespace std;

int main()
{
    SetConsoleOutputCP(CP_UTF8);

    if (GetFileAttributesA("node_modules") == INVALID_FILE_ATTRIBUTES)
    {
        string choice = "y";
        cout << "错误：未找到依赖！" << endl;
        cout << "请确保已经安装 Node.js 和 npm 依赖！" << endl;
        cout << "启动自动安装依赖？(Y/n)" << endl;
        cin >> choice;
        if (choice == "n")
        {
            exit(1);
        }
        else
        {
            cout << "正在安装…" << endl;
            system("npm i");
        }
    }
    else
    {
        cout << "检测到依赖文件!" << endl;
        cout << "正在启动Luminide…" << endl;
        system("node App.js");
    }

    cout << "按任意键继续...";
    cin.ignore();
    cin.get();

    return 0;
}
